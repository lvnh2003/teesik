import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/type/product"
import { getImageUrl } from "@/lib/admin-api"
import { useState } from "react"
import AddToCartModal from "./add-to-cart-modal"
interface ProductCardProps {
  product: Product
  isSmall?: boolean
}

export default function ProductCard({ product, isSmall = true }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.variants && product.variants.length > 0) {
      setShowModal(true)
      return
    }
    setIsAdding(true)
  }
  return (
    <>
      <div className={`group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md ${isSmall == false ? 'w-[250px]':'' }`}>
        {product.is_new && <Badge className="absolute top-2 left-2 z-10 bg-blue-600">Mới</Badge>}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getImageUrl(product.main_image?.image_path || "") || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Yêu thích</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">
            {product?.category?.name ?? ""}
          </div>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-lg mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-bold text-lg">
                ${product.variants && product.variants.length > 0 ? product.variants[0].price : 0}
              </span>
            </div>
            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-gray-500">{product.variants.length} variants</span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal isOpen={showModal} onClose={() => setShowModal(false)} product={product} />
    </>
  )
}
