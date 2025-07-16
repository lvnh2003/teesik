import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/type/product"
import { getImageUrl } from "@/lib/admin-api"

interface ProductCardProps {
  product: Product
  isSmall?: boolean
}

export default function ProductCard({ product, isSmall = true }: ProductCardProps) {
  return (
    <div className={`group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md ${isSmall == false ? 'w-[200px]':'' }`}>
      {product.isNew && <Badge className="absolute top-2 left-2 z-10 bg-blue-600">Mới</Badge>}
      {product.discount && product.discount > 0 && (
        <Badge className="absolute top-2 right-2 z-10 bg-red-500">-{product.discount}%</Badge>
      )}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={
            product.main_image
              ? getImageUrl(`${product.main_image.image_path}`)
              : "/placeholder.svg"
          }
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-white text-gray-900 hover:bg-gray-100">
              <ShoppingCart className="h-4 w-4 mr-2" />
              { isSmall ? (
                "Thêm vào giỏ"
              ): null}
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Yêu thích</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category?.name}</div>
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-lg mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center">
          <span className="font-bold text-lg">{product.price}₫</span>
          {product.originalPrice && <span className="text-gray-400 line-through ml-2">đ{product.originalPrice}</span>}
        </div>
      </div>
    </div>
  )
}
