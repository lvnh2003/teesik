// API utilities for admin operations
import { getAuthToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Generic API request function with authentication
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: any,
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

// Product Types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  category_id: number
  category?: Category
  images: ProductImage[]
  is_new?: boolean
  is_featured?: boolean
  stock_quantity: number
  sku: string
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  original_price?: number
  category_id: number
  is_new?: boolean
  is_featured?: boolean
  stock_quantity: number
  sku: string
  images?: File[]
}

// User Types
export interface AdminUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

// Product API Functions
export async function getProducts(page = 1, limit = 10): Promise<{ data: Product[]; meta: any }> {
  return apiRequest<{ data: Product[]; meta: any }>(`/admin/products?page=${page}&limit=${limit}`)
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

export async function updateProduct(id: number, productData: Partial<ProductFormData>): Promise<{ data: Product }> {
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

    // Add _method field for Laravel to recognize as PUT
    formData.append("_method", "PUT")

    // Custom fetch for FormData
    const token = getAuthToken()
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "POST", // Actually sends as POST but Laravel will treat as PUT
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
  return apiRequest<{ data: Product }>(`/admin/products/${id}`, "PUT", productData)
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/products/${id}`, "DELETE")
}

// Category API Functions
export async function getCategories(): Promise<{ data: Category[] }> {
  return apiRequest<{ data: Category[] }>("/admin/categories")
}

// User API Functions
export async function getUsers(page = 1, limit = 10): Promise<{ data: AdminUser[]; meta: any }> {
  return apiRequest<{ data: AdminUser[]; meta: any }>(`/admin/users?page=${page}&limit=${limit}`)
}

export async function getUser(id: number): Promise<{ data: AdminUser }> {
  return apiRequest<{ data: AdminUser }>(`/admin/users/${id}`)
}

export async function updateUser(id: number, userData: Partial<AdminUser>): Promise<{ data: AdminUser }> {
  return apiRequest<{ data: AdminUser }>(`/admin/users/${id}`, "PUT", userData)
}

export async function deleteUser(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/admin/users/${id}`, "DELETE")
}

// Dashboard Stats
export interface DashboardStats {
  total_products: number
  total_users: number
  total_orders: number
  recent_orders: any[]
  revenue: {
    daily: number
    weekly: number
    monthly: number
  }
}

export async function getDashboardStats(): Promise<{ data: DashboardStats }> {
  return apiRequest<{ data: DashboardStats }>("/admin/dashboard")
}
