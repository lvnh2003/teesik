"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Product } from "@/type/product"
import { toast } from "sonner" // Assuming sonner is installed or stick to console/alert if not.
// Wait, package.json has "sonner": "^1.7.1". So I can use it.

interface WishlistContextType {
    items: Product[]
    addItem: (product: Product) => void
    removeItem: (productId: number) => void
    isInWishlist: (productId: number) => boolean
    clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Product[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("wishlist")
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse wishlist", e)
            }
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wishlist", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (product: Product) => {
        if (items.some((i) => i.id === product.id)) {
            toast.info("Đã có trong danh sách yêu thích")
            return
        }
        setItems((prev) => [...prev, product])
        toast.success("Đã thêm vào danh sách yêu thích")
    }

    const removeItem = (productId: number) => {
        setItems((prev) => prev.filter((i) => i.id !== productId))
        toast.success("Đã xóa khỏi danh sách yêu thích")
    }

    const isInWishlist = (productId: number) => {
        return items.some((i) => i.id === productId)
    }

    const clearWishlist = () => {
        setItems([])
    }

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}
