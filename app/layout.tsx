"use client"
import type React from "react"
import { Playfair_Display } from "next/font/google"
import "@/app/globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { inter } from "@/lib/fonts"
import { AuthProvider } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

// Định nghĩa font Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const isAdminRoute = pathname?.startsWith("/admin")
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
          {!isAdminRoute && <MainNav />}
            <main>{children}</main>
            {!isAdminRoute && <Footer />}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
