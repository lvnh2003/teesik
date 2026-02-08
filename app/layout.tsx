"use client"
import type React from "react"
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google"
import "@/app/globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { usePathname } from "next/navigation"

// Định nghĩa font Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-playfair",
})

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const isAdminRoute = pathname?.startsWith("/admin")
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <WishlistProvider>
              {!isAdminRoute && <MainNav />}
              <main>{children}</main>
              {!isAdminRoute && <Footer />}
            </WishlistProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
