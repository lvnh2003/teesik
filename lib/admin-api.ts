// API utilities for admin operations
import { Category, Product, ProductFormData } from "@/type/product"
import { getAuthToken } from "./auth"
import { DashboardStats, User } from "@/type"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Generic API request function with authentication
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: unknown,
  customHeaders: Record<string, string> = {},
  requireAuth = true
): Promise<T> {
  const token = getAuthToken()

  if (requireAuth && !token) {
    throw new Error("Authentication required")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Public Cart identification
  if (typeof window !== 'undefined') {
    const cartId = localStorage.getItem('cart_id') || 'cart_' + Math.random().toString(36).substr(2, 9);
    if (!localStorage.getItem('cart_id')) localStorage.setItem('cart_id', cartId);
    headers["X-Cart-ID"] = cartId;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const responseData = await response.json()

  // Handle created response
  if (response.status === 201) return responseData;

  if (!response.ok) {
    throw new Error(responseData.message || `API request failed with status ${response.status}`)
  }

  return responseData
}

// ==================== Product API Functions ====================
type ProductQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number | string;
  status?: 'new' | 'featured' | 'active' | 'inactive' | 'out_of_stock' | 'low_stock';
  is_new?: string | boolean;
  is_featured?: string | boolean;
  sort_field?: 'name' | 'created_at' | 'updated_at';
  sort_direction?: 'asc' | 'desc';
};

export async function getProducts(params: ProductQueryParams = {}): Promise<{
  data: Product[];
  meta?: any;
}> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value.toString());
    }
  });

  const queryString = query.toString();
  // Use public endpoint
  const url = `/products${queryString ? `?${queryString}` : ''}`;

  return apiRequest<{ data: Product[], meta?: any }>(url, "GET", undefined, {}, false);
}

export async function getProduct(id: number): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/products/${id}`, "GET", undefined, {}, false)
}

export async function createProduct(productData: ProductFormData): Promise<{ data: Product }> {
  // Handle file uploads with FormData
  if (productData.images && productData.images.length > 0) {
    const formData = new FormData()

    // Append all non-file fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, String(productData[key as keyof ProductFormData]))
      }
    })

    // Append images
    productData.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image)
    })

    // Custom fetch for FormData
    const token = getAuthToken()
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.message || `API request failed with status ${response.status}`)
    }

    return responseData
  }

  // Regular JSON request if no images
  return apiRequest<{ data: Product }>("/admin/products", "POST", productData)
}

export async function updateProduct(productId: number, formData: FormData) {
  const token = getAuthToken()
  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "POST", // Laravel sử dụng POST với _method=PUT
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update product")
  }

  return await response.json()
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/products/${id}`, "DELETE")
}

// ==================== User API Functions ====================

export async function getUsers(page = 1, limit = 10): Promise<{ data: User[] }> {
  return apiRequest<{ data: User[] }>(`/admin/users?page=${page}&limit=${limit}`)
}

export async function getUser(id: number): Promise<{ data: User }> {
  return apiRequest<{ data: User }>(`/admin/users/${id}`)
}

export async function updateUser(id: number, userData: Partial<User>): Promise<{ data: User }> {
  return apiRequest<{ data: User }>(`/admin/users/${id}`, "PUT", userData)
}

export async function deleteUser(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/users/${id}`, "DELETE")
}

// ==================== Dashboard Stats API Functions ====================

export async function getDashboardStats(): Promise<{ data: DashboardStats }> {
  return apiRequest<{ data: DashboardStats }>("/admin/dashboard")
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=400&width=400"

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) return imagePath

  // If it starts with /storage, it's already formatted
  if (imagePath.startsWith("/storage")) {
    const baseUrl = API_BASE_URL.replace("/api", "") || "http://localhost:8000"
    return `${baseUrl}${imagePath}`
  }

  // Otherwise, construct the full storage URL
  const baseUrl = API_BASE_URL.replace("/api", "") || "http://localhost:8000"
  // Ensure we don't double slash
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${baseUrl}/storage/${cleanPath}`
}
// ==================== Category API Functions ====================

export async function getCategories(): Promise<{ data: Category[] }> {
  // Assuming categories endpoint is also public or we use admin one (which requires auth).
  // Ideally make a public one, but for now let's try calling it. If it fails due to Auth, we'll need a public route.
  // The route is protected in api.php. Let's assume we need to fix it or frontend is admin?
  // Frontend public pages use getCategories(). We need a public categories endpoint.
  // Let's call /admin/categories but check auth... wait.
  // Public pages shouldn't use admin APIs. 
  // Refactoring to use PRODUCTS endpoint which returns categories embedded or separate public categories endpoint.
  // For now, let's try to mock or use what we have. 
  // I will add public categories route locally if needed or just return hardcoded for filters if strict.
  // Actually, I can add a public categories route quickly in api.php too.
  return apiRequest<{ data: Category[] }>("/admin/categories", "GET", undefined, {}, false)
}

export async function createCategory(name: string): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>("/admin/categories", "POST", { name })
}

export async function updateCategory(id: number, data: { name: string }): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/admin/categories/${id}`, "PUT", data)
}

export async function deleteCategory(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/categories/${id}`, "DELETE")
}

// ==================== Cart & Checkout API Functions ====================

export async function getCart() {
  return apiRequest<any>('/cart', 'GET', undefined, {}, false);
}

export async function addToCart(productId: number, quantity: number = 1, variantId?: number) {
  return apiRequest<any>('/cart/add', 'POST', { product_id: productId, quantity, variant_id: variantId }, {}, false);
}

export async function updateCartItem(productId: number, quantity: number) {
  return apiRequest<any>('/cart/update', 'POST', { product_id: productId, quantity }, {}, false);
}

export async function removeFromCart(productId: number) {
  return apiRequest<any>('/cart/remove', 'POST', { product_id: productId }, {}, false);
}

export async function checkout(data: any) {
  return apiRequest<any>('/checkout', 'POST', data, {}, false);
}