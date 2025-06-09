"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

export default function ProductSlider() {
  const { t } = useLanguage()

  const products = [
    {
      id: 1,
      name: "MILANO TOTE",
      price: 1290000,
      image: "/images/tote-bag-1.jpg",
      category: "Tote Bags",
      isNew: true,
      slug: "milano-tote",
    },
    {
      id: 2,
      name: "PARIS CROSSBODY",
      price: 890000,
      originalPrice: 1190000,
      image: "/images/crossbody-bag-1.jpg",
      category: "Crossbody",
      isNew: false,
      slug: "paris-crossbody",
    },
    {
      id: 3,
      name: "TOKYO BACKPACK",
      price: 1490000,
      image: "/images/backpack-1.jpg",
      category: "Backpacks",
      isNew: true,
      slug: "tokyo-backpack",
    },
    {
      id: 4,
      name: "NEW YORK CLUTCH",
      price: 690000,
      originalPrice: 990000,
      image: "/images/clutch-bag-1.jpg",
      category: "Clutches",
      isNew: false,
      slug: "new-york-clutch",
    },
    {
      id: 5,
      name: "LONDON SHOULDER BAG",
      price: 1190000,
      image: "/images/shoulder-bag-1.jpg",
      category: "Shoulder Bags",
      isNew: false,
      slug: "london-shoulder-bag",
    },
    {
      id: 6,
      name: "BERLIN MESSENGER",
      price: 1390000,
      originalPrice: 1690000,
      image: "/images/messenger-bag-1.jpg",
      category: "Messenger Bags",
      isNew: false,
      slug: "berlin-messenger",
    },
  ]

  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const scrollAmount = 320

      if (direction === "left") {
        sliderRef.current.scrollLeft = scrollLeft - scrollAmount
      } else {
        sliderRef.current.scrollLeft = scrollLeft + scrollAmount
      }

      // Check if we can scroll in either direction
      setTimeout(() => {
        if (sliderRef.current) {
          setShowLeftButton(sliderRef.current.scrollLeft > 0)
          setShowRightButton(sliderRef.current.scrollLeft < scrollWidth - clientWidth - 10)
        }
      }, 100)
    }
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[280px] group">
            <Link href={`/products/${product.slug}`}>
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                {product.isNew && (
                  <Badge className="absolute top-3 left-3 z-10 bg-gray-900 text-white hover:bg-gray-800 shadow-lg">
                    NEW
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gray-700 text-white hover:bg-gray-800 shadow-lg">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-100 shadow-lg">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {t("common.addToCart")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
              <h3 className="font-bold text-sm tracking-wider group-hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/3 transform -translate-y-1/2 z-10 bg-white shadow-xl hover:bg-gray-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/3 transform -translate-y-1/2 z-10 bg-white shadow-xl hover:bg-gray-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
