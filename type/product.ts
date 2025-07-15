// Product Types
export interface Product {
    id: number
    name: string
    description: string
    price: number
    category_id: number
    category?: Category
    images?: ProductImage[] 
    is_new?: boolean
    is_featured?: boolean
    created_at?: string
    updated_at?: string
    variants?: ProductVariant[]
    [key: string]: any
  }
  
  export interface ProductVariant {
    id: number
    sku: string
    price: number
    original_price?: number
    stock_quantity: number
    attributes: Record<string, string>
    images?: ProductImage[] 
    image: File | null
    imagePreviewUrl: string
    product_id: number
    isDelete: boolean
  }
  
  export interface ProductImage {
    id: number
    product_id: number
    image_path: string
    alt_text: string
    product_variant_id: number
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
    variants?: {
      sku: string
      price: number
      original_price?: number
      stock_quantity: number
      attributes: Record<string, string>
      images: File[]
    }[]
  }