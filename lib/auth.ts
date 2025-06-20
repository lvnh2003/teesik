// Authentication utilities and API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
import { getCookie, setCookie, deleteCookie } from "cookies-next"
export interface User {
  id: number
  email: string
  name: string
  role: string
  phone?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
    token_type: string
    expires_in: number
  }
  message: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Login API call
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }

  return data
}

// Register API call
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }

  return data
}

// Get current user API call
export async function getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to get user data")
  }

  return data
}

// Token management
export function setAuthToken(token: string): void {
  setCookie("auth_token", token, { maxAge: 60 * 60 * 24, path: "/" }) // 1 day
}

export function getAuthToken(): string | null {
  const token = getCookie("auth_token")
  return typeof token === "string" ? token : null
}

export function removeAuthToken(): void {
  deleteCookie("auth_token", { path: "/" })
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}