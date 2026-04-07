import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google"
import "@/app/globals.css"
import ClientLayout from "@/components/client-layout"

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

export const metadata: Metadata = {
  title: {
    default: "Teesik — Thời trang & Phong cách",
    template: "%s | Teesik",
  },
  description: "Khám phá bộ sưu tập thời trang đa dạng: Quần áo, Túi xách, Phụ kiện. Giao hàng nhanh, giá tốt.",
  keywords: ["thời trang", "quần áo", "túi xách", "teesik", "fashion"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Teesik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${playfair.variable}`}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

