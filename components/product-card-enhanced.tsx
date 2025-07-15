"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    isNew?: boolean
    slug: string
    hoverImage?: string
  }
  effectActive?: boolean
  variant?: "default" | "enhanced"
}

export default function ProductCardEnhanced({ product, effectActive = true, variant = "enhanced" }: ProductCardProps) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const currentImage = isHovered && product.hoverImage ? product.hoverImage : product.image

  return (
    <div className="group">
      <Link href={`/products/${product.id}`}>
        <div
          className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100 product-hover-effect"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badges */}
          {product.isNew && (
            <Badge className="absolute top-4 left-4 z-20 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
              {t("product.new")}
            </Badge>
          )}
          {product.originalPrice && (
            <Badge className="absolute top-4 right-4 z-20 bg-red-500 text-white hover:bg-red-600 text-xs tracking-wider">
              SALE
            </Badge>
          )}

          {/* Product Image */}
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            priority
          />

          {/* Shine effect removed */}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-5" />

          {/* Hover Content */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-15">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Eye className="h-6 w-6 text-black" />
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-15">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-white text-black hover:bg-gray-100 font-medium tracking-wider shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t("product.addToCart")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 border-white text-black hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to wishlist logic
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{product.category}</p>
        <h3 className="text-lg font-bold tracking-tight uppercase group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
