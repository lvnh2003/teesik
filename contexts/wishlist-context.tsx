"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Product } from "@/type/product"
import { toast } from "sonner" // Assuming sonner is installed or stick to console/alert if not.
import { useAuth } from "@/contexts/auth-context"
import { WishlistService } from "@/services/wishlist"

interface WishlistContextType {
    items: Product[]
    addItem: (product: Product) => void
    removeItem: (productId: string | number) => void
    isInWishlist: (productId: string | number) => boolean
    toggleWishlist: (product: Product) => void
    clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Product[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    const { isLoggedIn } = useAuth()

    useEffect(() => {
        const fetchRemote = async () => {
            if (isLoggedIn) {
                try {
                    const res = await WishlistService.fetchWishlists()
                    if (res.success && res.data) {
                        setItems(res.data)
                    }
                } catch (e) {
                    console.error("Failed to fetch wishlist from server", e)
                }
            }
        }
        
        const saved = localStorage.getItem("wishlist")
        if (saved && !isLoggedIn) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse wishlist", e)
            }
        }
        
        if (isLoggedIn) {
            fetchRemote()
        }
        setIsLoaded(true)
    }, [isLoggedIn])

    useEffect(() => {
        if (isLoaded && !isLoggedIn) {
            localStorage.setItem("wishlist", JSON.stringify(items))
        }
    }, [items, isLoaded, isLoggedIn])

    const addItem = async (product: Product) => {
        if (items.some((i) => i.id === product.id)) {
            toast.info("Đã có trong danh sách yêu thích")
            return
        }
        
        // Optimistic update
        setItems((prev) => [...prev, product])
        toast.success("Đã thêm vào danh sách yêu thích")
        
        if (isLoggedIn) {
            try {
                await WishlistService.toggleWishlist(product.id)
            } catch (error) {
                // Ignore errors for optimistic UI or implement rollback
            }
        }
    }

    const removeItem = async (productId: string | number) => {
        setItems((prev) => prev.filter((i) => i.id !== productId))
        toast.success("Đã xóa khỏi danh sách yêu thích")
        
        if (isLoggedIn) {
            try {
                await WishlistService.toggleWishlist(productId)
            } catch (error) {
                // Ignore
            }
        }
    }

    const isInWishlist = (productId: string | number) => {
        return items.some((i) => i.id === productId)
    }

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeItem(product.id)
        } else {
            addItem(product)
        }
    }

    const clearWishlist = () => {
        setItems([])
    }

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleWishlist, clearWishlist }}>
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
