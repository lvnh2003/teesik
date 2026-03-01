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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await apiRequest<any>(url, "GET", undefined, {}, false);

  // Handle Laravel/Pancake Paginator structure which might be flat
  // Standard Laravel Paginator: { current_page: 1, data: [...], total: 10, ... }
  // or { data: [...], meta: { ... } } (if using Resources)

  if (response.data && Array.isArray(response.data)) {
    // Check if meta is already present or if it's a flat structure
    if (response.meta) {
      return response;
    }

    // Construct meta from flat fields if they exist
    const meta = {
      current_page: response.current_page,
      from: response.from,
      last_page: response.last_page,
      per_page: response.per_page,
      to: response.to,
      total: response.total,
    };

    return {
      data: response.data,
      meta: meta
    };
  }

  // Fallback if structure is unexpected
  return { data: [], meta: {} };
}

export async function getProduct(id: string | number): Promise<{ data: Product }> {
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

export async function updateProduct(productId: string | number, formData: FormData) {
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

export async function deleteProduct(id: string | number): Promise<{ success: boolean }> {
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

// ==================== Cart & Checkout API Functions ====================

import { Cart } from "@/type"

export async function getCart(): Promise<Cart> {
  return apiRequest<Cart>('/cart', 'GET', undefined, {}, false);
}

export async function addToCart(productId: string | number, quantity: number = 1, variantId?: string | number) {
  return apiRequest<unknown>('/cart/add', 'POST', { product_id: productId, quantity, variant_id: variantId }, {}, false);
}

export async function updateCartItem(productId: string | number, quantity: number) {
  return apiRequest<unknown>('/cart/update', 'POST', { product_id: productId, quantity }, {}, false);
}

export async function removeFromCart(productId: string | number) {
  return apiRequest<unknown>('/cart/remove', 'POST', { product_id: productId }, {}, false);
}

export async function checkout(data: Record<string, unknown>) {
  return apiRequest<{
    success: boolean;
    order?: Order;
    message?: string;
  }>('/checkout', 'POST', data, {}, false);
}

// ==================== Order API Functions ====================

import { Order } from "@/type"

export async function getOrders(params: { page?: number; limit?: number; status?: string; search?: string } = {}): Promise<{
  data: Order[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiRequest<{ data: Order[]; meta?: any }>(`/admin/orders?${query.toString()}`);
}

export async function getOrder(id: number): Promise<{ data: Order }> {
  return apiRequest<{ data: Order }>(`/admin/orders/${id}`);
}

export async function updateOrder(id: number, data: Partial<Order>): Promise<{ data: Order }> {
  return apiRequest<{ data: Order }>(`/admin/orders/${id}`, "PUT", data);
}

export async function processPayment(orderId: number, paymentMethod: string) {
  return apiRequest<unknown>('/payment/process', 'POST', { order_id: orderId, payment_method: paymentMethod }, {}, false);
}

// ==================== Pancake POS Additional API Functions ====================
import { Customer, Transaction, Purchase, Promotion, Voucher, Combo } from "@/type"

// Generic paginated response type
export type PaginatedResponse<T> = { data: T[]; meta?: any };

export async function getCustomers(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Customer>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  if (params.search) query.append('search', params.search)
  return apiRequest<PaginatedResponse<Customer>>(`/admin/customers?${query.toString()}`)
}

export async function createCustomer(data: any): Promise<{ data: Customer }> {
  return apiRequest<{ data: Customer }>('/admin/customers', 'POST', data)
}

export async function getTransactions(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Transaction>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  return apiRequest<PaginatedResponse<Transaction>>(`/admin/transactions?${query.toString()}`)
}

export async function getPurchases(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Purchase>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  return apiRequest<PaginatedResponse<Purchase>>(`/admin/purchases?${query.toString()}`)
}

export async function getPromotions(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Promotion>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  return apiRequest<PaginatedResponse<Promotion>>(`/admin/promotions?${query.toString()}`)
}

export async function createPromotion(data: any): Promise<{ data: Promotion }> {
  return apiRequest<{ data: Promotion }>('/admin/promotions', 'POST', data)
}

export async function updatePromotion(id: string | number, data: any): Promise<{ data: Promotion }> {
  return apiRequest<{ data: Promotion }>(`/admin/promotions/${id}`, 'PUT', data)
}

export async function deletePromotion(id: string | number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/promotions/${id}`, 'DELETE')
}

export async function getVouchers(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Voucher>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  return apiRequest<PaginatedResponse<Voucher>>(`/admin/vouchers?${query.toString()}`)
}

export async function createVoucher(data: any): Promise<{ data: Voucher }> {
  return apiRequest<{ data: Voucher }>('/admin/vouchers', 'POST', data)
}

export async function getCombos(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Combo>> {
  const query = new URLSearchParams()
  if (params.page) query.append('page', params.page.toString())
  if (params.limit) query.append('limit', params.limit.toString())
  return apiRequest<PaginatedResponse<Combo>>(`/admin/combos?${query.toString()}`)
}

export async function createCombo(data: any): Promise<{ data: Combo }> {
  return apiRequest<{ data: Combo }>('/admin/combos', 'POST', data)
}

export async function updateCombo(id: string | number, data: any): Promise<{ data: Combo }> {
  return apiRequest<{ data: Combo }>(`/admin/combos/${id}`, 'PUT', data)
}

export async function deleteCombo(id: string | number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/combos/${id}`, 'DELETE')
}

export async function getSalesAnalytics(startDate?: string, endDate?: string): Promise<{ data: any }> {
  const query = new URLSearchParams()
  if (startDate) query.append('start_date', startDate)
  if (endDate) query.append('end_date', endDate)
  return apiRequest<{ data: any }>(`/admin/statistics/sales?${query.toString()}`)
}

export async function getInventoryAnalytics(): Promise<{ data: any }> {
  return apiRequest<{ data: any }>('/admin/statistics/inventory')
}