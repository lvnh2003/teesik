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
): Promise<T> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const responseData = await response.json()

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
  sort_field?: 'name' | 'created_at' | 'updated_at';
  sort_direction?: 'asc' | 'desc';
};
export async function getProducts(params: ProductQueryParams = {}): Promise<{
  data: Product[];
}> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value.toString());
    }
  });

  const queryString = query.toString();
  const url = `/admin/products${queryString ? `?${queryString}` : ''}`;

  return apiRequest<{ data: Product[] }>(url);
}
export async function getProduct(id: number): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/admin/products/${id}`)
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

export async function getUsers(page = 1, limit = 10): Promise<{ data: User[]}> {
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
  return `${baseUrl}/storage/${imagePath}`
}
// ==================== Category API Functions ====================

export async function getCategories(): Promise<{ data: Category[] }> {
  return apiRequest<{ data: Category[] }>("/admin/categories")
}
// New: Create Category
export async function createCategory(
  name: string,
): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>("/admin/categories", "POST", { name })
}
export async function updateCategory(id: number, categoryData: Partial<Category>): Promise<{ data : Category }> {
  return apiRequest<{data: Category }>(`/admin/categories/${id}`, "PUT", categoryData)
}

// New: Delete Category
export async function deleteCategory(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/categories/${id}`, "DELETE")
}