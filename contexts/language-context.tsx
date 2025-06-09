"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "vi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Navigation
    "nav.new": "MỚI",
    "nav.bags": "TÚI XÁCH",
    "nav.collections": "BỘ SƯU TẬP",
    "nav.dropshipping": "DROPSHIPPING",
    "nav.about": "VỀ CHÚNG TÔI",
    "nav.newArrivals": "Sản Phẩm Mới",
    "nav.shop": "Cửa Hàng",
    "nav.search": "Tìm kiếm sản phẩm...",

    // Hero
    "hero.title": "LUXE BAGS",
    "hero.subtitle":
      "Túi xách cao cấp được thiết kế cho phong cách sống hiện đại. Được chế tác tỉ mỉ, bền bỉ theo thời gian.",
    "hero.shopCollection": "Mua Sắm",
    "hero.startDropshipping": "Bắt Đầu Dropshipping",

    // Product Grid
    "product.addToCart": "THÊM VÀO GIỎ",
    "product.new": "MỚI",
    "product.sale": "GIẢM GIÁ",

    // Stats
    "stats.customers": "Khách Hàng Hài Lòng",
    "stats.countries": "Quốc Gia Trên Thế Giới",
    "stats.designs": "Thiết Kế Cao Cấp",
    "stats.support": "Hỗ Trợ Khách Hàng",

    // Newsletter
    "newsletter.title": "Cập Nhật Tin Tức",
    "newsletter.subtitle":
      "Đăng ký nhận bản tin để được truy cập độc quyền vào các bộ sưu tập mới, ưu đãi đặc biệt và cảm hứng phong cách.",
    "newsletter.placeholder": "Nhập email của bạn",
    "newsletter.subscribe": "Đăng Ký",
    "newsletter.subscribing": "Đang đăng ký...",
    "newsletter.thankYou": "Cảm Ơn Bạn!",
    "newsletter.success":
      "Bạn đã đăng ký thành công nhận bản tin của chúng tôi. Hãy sẵn sàng cho những cập nhật và ưu đãi độc quyền!",

    // Collection Banner
    "collection.summer": "Bộ Sưu Tập Mùa Hè",
    "collection.summerDesc":
      "Khám phá bộ sưu tập mùa hè mới nhất của chúng tôi với chất liệu nhẹ, màu sắc rực rỡ và thiết kế hoàn hảo cho những cuộc phiêu lưu thời tiết ấm áp.",
    "collection.explore": "Khám Phá Bộ Sưu Tập",
    "collection.newDesigns": "Thiết Kế Mới",
    "collection.premiumQuality": "Chất Lượng Cao Cấp",

    // Categories
    "category.shopByCategory": "Mua Sắm Theo Danh Mục",
    "category.findPerfect": "Tìm chiếc túi hoàn hảo cho mọi dịp và phong cách",
    "category.toteDesc": "Hoàn hảo cho công việc và đồ dùng hàng ngày",
    "category.crossbodyDesc": "Tiện lợi rảnh tay với phong cách",
    "category.backpackDesc": "Thiết kế hiện đại cho những cuộc phiêu lưu đô thị",
    "category.shopNow": "Mua Ngay",

    // Common
    "common.viewAll": "Xem Tất Cả",
    "common.latestDrops": "Sản Phẩm Mới Nhất",
    "common.discoverNewest": "Khám phá bộ sưu tập túi xách cao cấp mới nhất được thiết kế cho phong cách sống hiện đại",

    // Announcement
    "announcement.freeShipping": "Miễn Phí Vận Chuyển Toàn Cầu Cho Đơn Hàng Trên $100",
  },
  en: {
    // Navigation
    "nav.new": "NEW",
    "nav.bags": "BAGS",
    "nav.collections": "COLLECTIONS",
    "nav.dropshipping": "DROPSHIPPING",
    "nav.about": "ABOUT",
    "nav.newArrivals": "New Arrivals",
    "nav.shop": "Shop",
    "nav.search": "Search products...",

    // Hero
    "hero.title": "LUXE BAGS",
    "hero.subtitle": "Premium handbags designed for the modern lifestyle. Crafted with precision, built to last.",
    "hero.shopCollection": "Shop Collection",
    "hero.startDropshipping": "Start Dropshipping",

    // Product Grid
    "product.addToCart": "ADD TO CART",
    "product.new": "NEW",
    "product.sale": "SALE",

    // Stats
    "stats.customers": "Happy Customers",
    "stats.countries": "Countries Worldwide",
    "stats.designs": "Premium Designs",
    "stats.support": "Customer Support",

    // Newsletter
    "newsletter.title": "Stay Updated",
    "newsletter.subtitle":
      "Subscribe to our newsletter for exclusive access to new collections, special offers, and style inspiration.",
    "newsletter.placeholder": "Enter your email",
    "newsletter.subscribe": "Subscribe",
    "newsletter.subscribing": "Subscribing...",
    "newsletter.thankYou": "Thank You!",
    "newsletter.success":
      "You've successfully subscribed to our newsletter. Get ready for exclusive updates and offers!",

    // Collection Banner
    "collection.summer": "Summer Collection",
    "collection.summerDesc":
      "Discover our latest summer collection featuring lightweight materials, vibrant colors, and designs perfect for your warm-weather adventures.",
    "collection.explore": "Explore Collection",
    "collection.newDesigns": "New Designs",
    "collection.premiumQuality": "Premium Quality",

    // Categories
    "category.shopByCategory": "Shop by Category",
    "category.findPerfect": "Find the perfect bag for every occasion and style",
    "category.toteDesc": "Perfect for work and daily essentials",
    "category.crossbodyDesc": "Hands-free convenience with style",
    "category.backpackDesc": "Modern designs for urban adventures",
    "category.shopNow": "Shop Now",

    // Common
    "common.viewAll": "View All Products",
    "common.latestDrops": "Latest Drops",
    "common.discoverNewest": "Discover our newest collection of premium handbags designed for the modern lifestyle",

    // Announcement
    "announcement.freeShipping": "Free Worldwide Shipping on Orders Over $100",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
