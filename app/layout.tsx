import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import "@/app/globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { inter } from "@/lib/fonts"
import { AuthProvider } from "@/contexts/auth-context"
// // Định nghĩa font Inter
// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// })

// Định nghĩa font Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata = {
  title: "TEESIK - Túi xách thời trang cao cấp & Dropshipping",
  description: "Cung cấp túi xách thời trang cao cấp và giải pháp dropshipping toàn cầu",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <MainNav />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
