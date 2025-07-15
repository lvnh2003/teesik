"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Product } from "@/type/product"
import { getImageUrl } from "@/lib/admin-api"

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  const { t } = useLanguage()

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Transform API products to match component expectations
  const transformedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price || 0,
    originalPrice: product.original_price,
    image:
      product.images && product.images.length > 0
        ? getImageUrl(`${product.images[0].image_path}`)
        : "/placeholder.svg",
    category: product.category?.name || "UNCATEGORIZED",
    isNew: product.is_new || false,
  }))

  if (transformedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có sản phẩm nào để hiển thị</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {transformedProducts.map((product) => (
        <div key={product.id} className="group">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
              {product.isNew && (
                <Badge className="absolute top-4 left-4 z-10 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
                  {t("product.new")}
                </Badge>
              )}
              {product.originalPrice && (
                <Badge className="absolute top-4 right-4 z-10 bg-red-500 text-white hover:bg-red-600 text-xs tracking-wider">
                  {t("product.sale")}
                </Badge>
              )}
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Hover Actions */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-100 font-medium tracking-wider">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t("product.addToCart")}
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/90 border-white text-black hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>

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
      ))}
    </div>
  )
}
