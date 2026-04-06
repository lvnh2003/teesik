"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { CartProvider } from "@/contexts/cart-context"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <AuthProvider>
      <LanguageProvider>
        <WishlistProvider>
          <CartProvider>
            {!isAdminRoute && <MainNav />}
            <main>{children}</main>
            {!isAdminRoute && <Footer />}
          </CartProvider>
        </WishlistProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
