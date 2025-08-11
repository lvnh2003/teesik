import { ProductVariant } from "./product"

export interface CartItem {
    id: number
    productId: number
    quantity: number
    userId: number
    variant?: ProductVariant
}