import { getCookie } from "cookies-next";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAuthToken(): string | null {
  const token = getCookie("auth_token");
  return typeof token === "string" ? token : null;
}

function generateCartId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return "cart_" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export async function localFetch<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Origin-Verify': 'teesik',
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (typeof window !== 'undefined') {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      cartId = generateCartId();
      localStorage.setItem('cart_id', cartId);
    }
    headers["X-Cart-ID"] = cartId;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`Request to ${endpoint} timed out after 10s`);
    controller.abort();
  }, 10000);

  // Link provided signal to our controller
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    options.signal.addEventListener('abort', () => controller.abort());
  }

  let response: Response;
  try {
    const endpointWithVersion = endpoint.startsWith('/v1') || endpoint.startsWith('/health')
      ? endpoint
      : `/v1${endpoint}`;

    response = await fetch(`${LOCAL_API_URL}${endpointWithVersion}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, 'Request was cancelled or timed out.');
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  clearTimeout(timeoutId);

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new ApiError(
      response.status,
      `Invalid JSON response from ${endpoint} (${response.status})`,
    );
  }

  if (response.ok) {
    return responseData as T;
  }

  if (retries > 0 && response.status >= 500) {
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, 2 - retries)));
    return localFetch(endpoint, options, retries - 1);
  }

  throw new ApiError(
    response.status,
    typeof (responseData as Record<string, unknown>).message === 'string'
      ? (responseData as Record<string, unknown>).message as string
      : `Request failed with status ${response.status}`,
    responseData,
  );
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=400&width=400"

  if (imagePath.startsWith("http")) return imagePath

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL
  const baseUrl = (LOCAL_API_URL as string).replace("/api", "") || "http://localhost:8000"

  if (imagePath.startsWith("/storage")) {
    return `${storageUrl || baseUrl}${imagePath}`
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  if (storageUrl) {
    return `${storageUrl}/${cleanPath}`
  }
  
  return `${baseUrl}/storage/${cleanPath}`
}
