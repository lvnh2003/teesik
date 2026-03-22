import { getCookie } from "cookies-next";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function getAuthToken(): string | null {
  const token = getCookie("auth_token");
  return typeof token === "string" ? token : null;
}

export async function localFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Ensure cart ID is added for public/guest cart logic
  if (typeof window !== 'undefined') {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      cartId = 'cart_' + Math.random().toString(36).substr(2, 9);
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

  const response = await fetch(`${LOCAL_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));
  
  if (response.status === 201) return responseData as T;

  if (!response.ok) {
    throw new Error(responseData.message || `API request failed with status ${response.status}`);
  }

  return responseData as T;
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=400&width=400"

  if (imagePath.startsWith("http")) return imagePath

  if (imagePath.startsWith("/storage")) {
    const baseUrl = LOCAL_API_URL.replace("/api", "") || "http://localhost:8000"
    return `${baseUrl}${imagePath}`
  }

  const baseUrl = LOCAL_API_URL.replace("/api", "") || "http://localhost:8000"
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${baseUrl}/storage/${cleanPath}`
}
