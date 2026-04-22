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

function getProductImageUrl(product: Product): string {
  const firstVariationImage = product.variations?.[0]?.images?.[0]?.image_path
  const image = product.main_image?.image_path ?? product.images?.[0]?.image_path ?? firstVariationImage
  if (!image) return ""
  return image.startsWith('http') ? image : getImageUrl(image)
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const imageUrl = getProductImageUrl(product) || "/default-image.jpg"
      await addToCart({
        product_id: product.id,
        variant_id: undefined,
        name: product.name,
        price: product.price,
        quantity: 1,
        slug: product.slug || "",
        image: imageUrl,
      })
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const hasImage = getProductImageUrl(product) !== ""

  const originalPrice = product.original_price && product.original_price > product.price

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-100 h-full">
      {/* Image area - fixed aspect ratio for uniform cards */}
      <div className="relative overflow-hidden bg-[#F0F0F0] aspect-[3/4]">
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

        {hasImage && (
          <Image
            src={getProductImageUrl(product)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Default icon when no image */}
        {!hasImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-200/80 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-gray-300" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <Button
            className="w-full bg-white text-black hover:bg-black hover:text-white uppercase font-bold tracking-widest text-xs h-9 shadow-lg rounded-none"
            onClick={(e) => {
              e.preventDefault()
              handleQuickAdd(e)
            }}
          >
            <ShoppingBag className="mr-2 h-3 w-3" /> Quick Add
          </Button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 ${isInWishlist(product.id) ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100 text-black hover:bg-black hover:text-white'}`}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Info - flex-col with push to bottom for alignment */}
      <div className="flex flex-col p-4 flex-grow min-h-0">
        {/* Category - fixed height slot */}
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5 min-h-[14px] truncate">
          {product.category?.name || 'Collection'}
        </p>

        {/* Name - line clamp for consistent height */}
        <div className="min-h-[2.5rem] mb-auto">
          <h3 className="font-semibold text-[15px] leading-tight line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
        </div>

        {/* Price - always at bottom, consistent height */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between gap-2 min-h-[28px]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[15px] leading-none">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through leading-none">
                  {formatPrice(product.original_price ?? 0)}
                </span>
              )}
            </div>
            {product.stock_quantity === 0 && (
              <Badge variant="secondary" className="text-[10px] uppercase shrink-0">
                Hết hàng
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
