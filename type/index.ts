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