import { User } from "."

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