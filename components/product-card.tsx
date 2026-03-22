import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/type/product"
import { getImageUrl } from "@/services/core"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: Product
  isSmall?: boolean
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isInWishlist(product.id) ? removeItem(product.id) : addItem(product)
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await addToCart(product.id, 1)
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart.`,
      })
    } catch (error) {
      console.error("Quick add error", error)
      toast({
        title: "Error",
        description: "Failed to add to cart.",
        variant: "destructive"
      })
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="group relative flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-[#F0F0F0] mb-4">
        {product.isNew && (
          <Badge className="absolute top-3 left-3 z-10 bg-black text-white hover:bg-black rounded-none uppercase tracking-wider text-[10px] px-2 py-1">
            New Arrival
          </Badge>
        )}
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-3 right-3 z-10 bg-red-600 text-white hover:bg-red-600 rounded-none uppercase tracking-wider text-[10px] px-2 py-1">
            -{product.discount}%
          </Badge>
        )}

        <Image
          src={
            product.main_image
              ? (product.main_image.image_path.startsWith('http') ? product.main_image.image_path : getImageUrl(product.main_image.image_path))
              : "/placeholder.svg"
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Quick Add Button - Slides up */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <Button
            className="w-full bg-white text-black hover:bg-black hover:text-white uppercase font-bold tracking-widest text-xs h-10 shadow-lg"
            onClick={handleQuickAdd}
          >
            <ShoppingBag className="mr-2 h-3 w-3" /> Quick Add
          </Button>
        </div>

        {/* Wishlist Button - Absolute top right (hidden initially) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 ${isInWishlist(product.id) ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100 text-black hover:bg-black hover:text-white'}`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link href={`/products/${product.id}`} className="group-hover:underline decoration-1 underline-offset-4">
              <h3 className="font-bold text-base uppercase tracking-tight leading-none mb-1">{product.name}</h3>
            </Link>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category?.name || 'Collection'}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-medium block">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through block">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
