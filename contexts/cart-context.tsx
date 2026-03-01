"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartItem as apiUpdateCartItem } from "@/lib/admin-api"
import { toast } from "@/components/ui/use-toast"

export interface CartItem {
    product_id: string | number
    variant_id?: string | number
    name: string
    price: number
    quantity: number
    image: string
    color?: string
    size?: string
    slug: string
}

interface CartContextType {
    items: CartItem[]
    cartCount: number
    isLoading: boolean
    addToCart: (productId: string | number, quantity?: number, variantId?: string | number) => Promise<void>
    removeFromCart: (productId: string | number) => Promise<void>
    updateQuantity: (productId: string | number, quantity: number) => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchCart = async () => {
        try {
            const data: any = await getCart()
            setItems(data.items || [])
        } catch (error) {
            console.error("Failed to load cart", error)
            setItems([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const refreshCart = async () => {
        await fetchCart()
    }

    const addToCart = async (productId: string | number, quantity: number = 1, variantId?: string | number) => {
        try {
            // Optimistic update (optional, but tricky with variants/merging. Let's rely on refresh for accuracy for now or simple optimistic)
            // ideally we just call API and refresh.
            await apiAddToCart(productId, quantity, variantId)
            await fetchCart()
            // toast handled by caller usually, or we can do it here? 
            // The caller (product page) was handling toast. Let's keep it that way or move it here. 
            // Caller handling gives more flexibility on message.
        } catch (error) {
            console.error("Add to cart error", error)
            throw error
        }
    }

    const removeFromCart = async (productId: string | number) => {
        try {
            setItems(prev => prev.filter(item => item.product_id !== productId))
            await apiRemoveFromCart(productId)
            await fetchCart()
        } catch (error) {
            console.error("Remove from cart error", error)
            // Revert on error?
            await fetchCart()
        }
    }

    const updateQuantity = async (productId: string | number, quantity: number) => {
        try {
            setItems(prev => prev.map(item => item.product_id === productId ? { ...item, quantity } : item))
            await apiUpdateCartItem(productId, quantity)
            await fetchCart()
        } catch (error) {
            console.error("Update quantity error", error)
            await fetchCart()
        }
    }

    const cartCount = items.reduce((total, item) => total + item.quantity, 0)

    return (
        <CartContext.Provider value={{ items, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, refreshCart }}>
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
