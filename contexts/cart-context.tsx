import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/language-context"

export interface CartItem {
    product_id: string | number
    variant_id?: string | number
    name: string
    price: number
    quantity: number
    image: string
    attributes?: Record<string, string>
    slug: string
}

interface CartContextType {
    items: CartItem[]
    cartCount: number
    isLoading: boolean
    addToCart: (item: CartItem) => Promise<void>
    removeFromCart: (productId: string | number, variantId?: string | number) => Promise<void>
    updateQuantity: (productId: string | number, variantId: string | number | undefined, quantity: number) => Promise<void>
    refreshCart: () => Promise<void>
    clearCart: () => void

    // Voucher
    voucherCode: string | null
    discountAmount: number
    applyVoucher: (code: string, discount: number) => void
    removeVoucher: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "teesik_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Voucher state
    const [voucherCode, setVoucherCode] = useState<string | null>(null)
    const [discountAmount, setDiscountAmount] = useState<number>(0)

    // Sync from LocalStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart))
            } catch (e) {
                console.error("Failed to parse cart storage", e)
            }
        }
        setIsLoading(false)
    }, [])

    // Sync to LocalStorage whenever items change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        }
    }, [items, isLoading])

    const refreshCart = async () => {
        // Now just a no-op, since state is local, or could re-read from storage
        const storedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart))
            } catch (e) {}
        }
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem(CART_STORAGE_KEY)
        setVoucherCode(null)
        setDiscountAmount(0)
    }

    const addToCart = async (newItem: CartItem) => {
        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                i => i.product_id === newItem.product_id && i.variant_id === newItem.variant_id
            )
            
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems]
                updatedItems[existingItemIndex].quantity += newItem.quantity
                return updatedItems
            } else {
                return [...prevItems, newItem]
            }
        })
        toast.success(t("cart.added"), {
            description: newItem.name
        })
    }

    const removeFromCart = async (productId: string | number, variantId?: string | number) => {
        const itemToRemove = items.find(i => i.product_id === productId && i.variant_id === variantId)
        setItems(prev => prev.filter(item => !(item.product_id === productId && item.variant_id === variantId)))
        if (itemToRemove) {
            toast.info(t("cart.removed"), {
                description: itemToRemove.name
            })
        }
    }

    const updateQuantity = async (productId: string | number, variantId: string | number | undefined, quantity: number) => {
        setItems(prev => prev.map(item => {
            if (item.product_id === productId && item.variant_id === variantId) {
                return { ...item, quantity: Math.max(1, quantity) }
            }
            return item
        }))
    }

    const cartCount = items.length

    const applyVoucher = (code: string, discount: number) => {
        setVoucherCode(code)
        setDiscountAmount(discount)
        toast.success(t("cart.voucherApplied") || "Voucher applied!")
    }

    const removeVoucher = () => {
        setVoucherCode(null)
        setDiscountAmount(0)
    }

    return (
        <CartContext.Provider value={{ 
            items, cartCount, isLoading, 
            addToCart, removeFromCart, updateQuantity, refreshCart, clearCart,
            voucherCode, discountAmount, applyVoucher, removeVoucher
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
