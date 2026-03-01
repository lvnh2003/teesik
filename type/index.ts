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

export interface OrderItem {
  id: number
  order_id: number
  product_id: string | null
  product_variant_id: string | null
  product_name: string
  quantity: number
  price: number
  variation_info?: string
  image?: string
  created_at?: string
  updated_at?: string
  product?: any
  variant?: any
}

export interface Order {
  id: number
  shop_id?: number
  user_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: number
  status: string // Pancake statuses might be different strings
  payment_status: string
  payment_method: string
  transaction_id: string | null
  created_at: string
  updated_at?: string
  items?: OrderItem[]
  user?: User
  // Pancake specific
  shipping_fee?: number
  cod?: number
  partner?: any
  note?: string
}


export interface DashboardStats {
  total_products: number
  total_users: number
  total_orders: number
  recent_orders: Order[]
  revenue: {
    daily: number
    weekly: number
    monthly: number
  }
}

export interface CartItem {
  product_id: string | number
  variant_id?: string | number
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Pancake POS additional entities
export interface Customer {
  id: string | number;
  name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Transaction {
  id: string | number;
  amount: number;
  status: string;
  payment_method?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Purchase {
  id: string | number;
  total_amount: number;
  supplier_name?: string;
  status?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Promotion {
  id: string | number;
  name: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export interface Voucher {
  id: string | number;
  code: string;
  discount_amount?: number;
  status?: string;
  [key: string]: any;
}

export interface Combo {
  id: string | number;
  name: string;
  price?: number;
  status?: string;
  [key: string]: any;
}