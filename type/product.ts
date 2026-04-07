// Product Types
export interface Product {
  id: string
  name: string
  description: string
  category?: Category
  category_id?: number
  images?: ProductImage[]
  created_at?: string
  updated_at?: string
  variations?: ProductVariant[]
  main_image?: ProductImage
  variants?: ProductVariant[]
  custom_id?: string
  tags?: string[]
  note?: string
  is_sell_negative?: boolean
  hide_config_product?: boolean
  price: number
  slug?: string
  sku?: string
  is_new?: boolean
  discount?: number
  isNew?: boolean
  original_price?: number
  stock_quantity?: number
  extras?: Record<string, unknown>
}

export interface ProductVariant {
  id: string
  sku: string
  price: number
  original_price?: number
  stock_quantity: number
  attributes: Record<string, string>
  weight?: number
  images?: ProductImage[]
  product_id: string
  isDelete: boolean
  extras?: Record<string, unknown>
}

export interface ProductVariantFormData extends ProductVariant {
  image: File | null
  imagePreviewUrl: string
}

export interface ProductImage {
  id: number
  product_id: string
  image_path: string
  alt_text: string
  product_variant_id: string
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
  original_price: number
  category_id: number | string
  stock_quantity: number
  sku: string
  images: File[]
  product_attributes?: { name: string; values: string[] }[]
  variations?: {
    sku: string
    price: number
    original_price: number
    stock_quantity: number
    attributes: { name: string; value: string }[]
    image?: File
  }[]
}