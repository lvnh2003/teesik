"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"
import { Product, ProductVariant } from "@/type/product"
import { CartItem } from "@/type/cart"
import { getImageUrl } from "@/lib/admin-api"

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setSelectedAttributes({})

      // Set default variant if available
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0]
        setSelectedVariant(firstVariant)
        setSelectedAttributes(firstVariant.attributes || {})
      } else {
        setSelectedVariant(null)
      }
    }
  }, [isOpen, product])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Format attribute value to display
  function formatAttributeValue(raw: string): string {
    try {
      const parsed = JSON.parse(raw);
      return parsed?.value || raw;
    } catch {
      return raw;
    }
  }

  // Get unique attributes from all variants (same logic as product page)
  const attributeOptions = (product.variants || []).reduce(
    (acc, variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          // Parse the JSON to get the actual attribute name
          try {
            const parsed = JSON.parse(value)
            const attributeName = parsed.name || key
            if (!acc[attributeName]) acc[attributeName] = new Set()
            acc[attributeName].add(value)
          } catch {
            // If not JSON, use the key as attribute name
            if (!acc[key]) acc[key] = new Set()
            acc[key].add(value)
          }
        })
      }
      return acc
    },
    {} as { [key: string]: Set<string> },
  )

  // Create a mapping from attribute names to their keys for variant lookup
  const attributeKeyMapping = (product.variants || []).reduce(
    (acc, variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          try {
            const parsed = JSON.parse(value)
            const attributeName = parsed.name || key
            acc[attributeName] = key
          } catch {
            acc[key] = key
          }
        })
      }
      return acc
    },
    {} as { [key: string]: string },
  )

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeKeyMapping[attributeName]]: value }
    setSelectedAttributes(newAttributes)

    // Find matching variant
    const matchingVariant = product.variants?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(newAttributes).every(([key, val]) => variant.attributes[key] === val)
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  // Check if variant is available (has stock) - same logic as product page
  const isVariantAvailable = (attributeName: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attributeKeyMapping[attributeName]]: value }
    const matchingVariant = product.variants?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(testAttributes).every(([key, val]) => variant.attributes[key] === val)
    })
    return matchingVariant && matchingVariant.stock_quantity > 0
  }

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      const cartItem: CartItem = {
        id: Date.now() + Math.random(),
        productId: product.id,
        userId: 1,
        quantity: quantity,
        variant: selectedVariant || undefined,
      }

      addToCart(cartItem)

      // Small delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 500))

      onClose()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }
  
  
  const currentPrice = selectedVariant?.price || 0
  const currentOriginalPrice = selectedVariant?.original_price || 0
  const currentStock = selectedVariant?.stock_quantity || 0
  const currentImage =
    selectedVariant?.images?.[0]?.image_path || product.main_image?.image_path || product.images?.[0]?.image_path
  console.log(selectedVariant);
  const hasVariants = product.variants && product.variants.length > 0
  const canAddToCart = !hasVariants || (hasVariants && selectedVariant && currentStock > 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">Thêm vào giỏ hàng</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={currentImage ? getImageUrl(currentImage) : "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
            {product.is_new && <Badge className="absolute top-2 left-2 bg-blue-600">NEW</Badge>}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{product.category.name}</p>
              )}
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold">{formatPrice(currentPrice)}</span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(currentOriginalPrice)}</span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {product.description || "Sản phẩm chất lượng cao với thiết kế hiện đại."}
              </p>
            </div>

            {/* Variant Selection */}
            {hasVariants && Object.keys(attributeOptions).length > 0 && (
              <div className="space-y-4">
                {Object.entries(attributeOptions).map(([attributeName, values]) => (
                  <div key={attributeName}>
                    <h3 className="font-semibold mb-3 text-lg capitalize">{attributeName}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from(values).map((value) => {
                        const isSelected = selectedAttributes[attributeKeyMapping[attributeName]] === value
                        const isAvailable = isVariantAvailable(attributeName, value)

                        return (
                          <button
                            key={value}
                            onClick={() => handleAttributeChange(attributeName, value)}
                            disabled={!isAvailable}
                            className={`relative border-2 px-4 py-3 rounded-lg font-medium transition-all ${
                              isSelected
                                ? "border-black bg-black text-white"
                                : isAvailable
                                  ? "border-gray-300 hover:border-gray-400 bg-white"
                                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {formatAttributeValue(value)}
                            {isSelected && (
                              <Check className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white rounded-full p-0.5" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              {currentStock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Còn hàng ({currentStock} sản phẩm)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Hết hàng</span>
                </>
              )}
              {selectedVariant && <span className="text-gray-500 ml-2">SKU: {selectedVariant.sku}</span>}
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Số lượng</h3>
              <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
                <button
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 py-3 border-l border-r border-gray-300 font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart || isAdding}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAdding ? "Đang thêm..." : `Thêm ${quantity} vào giỏ hàng`}
              </Button>

              {hasVariants && !selectedVariant && (
                <p className="text-sm text-red-600 mt-2 text-center">Vui lòng chọn tất cả tùy chọn ở trên</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
