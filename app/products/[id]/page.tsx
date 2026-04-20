"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Heart, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import ProductSlider from "@/components/product-slider"
import { ProductService } from "@/services/products"
import { getImageUrl } from "@/services/core"
import type { Product, ProductImage, ProductVariant } from "@/type/product"
import Loading from "@/app/loading"
import { useToast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation";
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export default function ProductPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({})
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const params = useParams();
  const id = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData } = await ProductService.getProduct(id)
        setProduct(productData)

        // Set default variant and attributes
        if (productData && productData.variations && productData.variations.length > 0) {
          const firstVariant = productData.variations[0]
          setSelectedVariant(firstVariant)
          if (firstVariant.attributes) {
            setSelectedAttributes(firstVariant.attributes)
          }
        }

        // Reset image index when product changes
        setSelectedImageIndex(0)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Reset image index when variant changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariant])
  function formatAttributeValue(raw: string): string {
    try {
      const parsed = JSON.parse(raw);
      return parsed?.value || raw;
    } catch (e) {
      // Trường hợp không phải JSON hợp lệ → trả nguyên
      return raw;
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!product) {
    return (
      <div className="container px-4 mx-auto py-32 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-6 uppercase tracking-tighter">{t("product.notFound")}</h1>
        <Link href="/products">
          <Button className="rounded-none bg-black text-white px-8 py-6 text-lg uppercase font-bold tracking-widest">{t("product.returnToCollection")}</Button>
        </Link>
      </div>
    )
  }

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Get images based on selected variant
  const getDisplayImages = (): ProductImage[] => {
    let imagesToDisplay: ProductImage[] = []

    // If a variant is selected and has images, prioritize variant images
    if (
      selectedVariant &&
      Array.isArray(selectedVariant.images) &&
      selectedVariant.images.length > 0
    ) {
      // Only include images that have the required ProductImage properties
      imagesToDisplay = (selectedVariant.images as ProductImage[]).filter(
        (img): img is ProductImage =>
          !!img &&
          typeof img === "object" &&
          "id" in img &&
          "image_path" in img
      )
    }

    // Add product images that are not variant-specific
    const productImages = (product.images || []).filter(
      (img) =>
        (!("product_variant_id" in img) || !img.product_variant_id)
    )

    // If no variant images, use product images
    if (imagesToDisplay.length === 0) {
      imagesToDisplay = productImages
    } else {
      // Add product images that aren't duplicated
      productImages.forEach((productImg) => {
        const isDuplicate = imagesToDisplay.some((variantImg) => variantImg.image_path === productImg.image_path)
        if (!isDuplicate) {
          imagesToDisplay.push(productImg)
        }
      })
    }

    // Remove duplicates and ensure we have valid images
    const uniqueImages = imagesToDisplay.filter(
      (img, index, self) => img && img.image_path && index === self.findIndex((i) => i.image_path === img.image_path),
    )

    return uniqueImages
  }

  const displayImages = getDisplayImages()
  const displayImagePaths = displayImages.length > 0
    ? displayImages.map(img => getImageUrl(img.image_path))
    : ["/placeholder.svg?height=1000&width=800"]

  // Get unique attributes from all variants
  const attributeOptions = (product.variations || []).reduce(
    (acc, variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = new Set()
          acc[key].add(value)
        })
      }
      return acc
    },
    {} as { [key: string]: Set<string> },
  )

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value }
    setSelectedAttributes(newAttributes)

    // Find matching variant
    const matchingVariant = product.variations?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(newAttributes).every(([key, val]) => variant.attributes[key] === val)
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  // Check if variant is available (has stock)
  const isVariantAvailable = (attributeName: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attributeName]: value }
    const matchingVariant = product.variations?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(testAttributes).every(([key, val]) => variant.attributes[key] === val)
    })
    return matchingVariant && matchingVariant.stock_quantity > 0
  }

  const currentPrice = selectedVariant?.price || product.price
  const currentOriginalPrice = selectedVariant?.original_price || product.original_price
  const currentStock = selectedVariant?.stock_quantity || product.stock_quantity || 0

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setIsAddingToCart(true)
      const itemToAdd = {
        product_id: product.id,
        variant_id: selectedVariant?.id,
        name: product.name,
        price: selectedVariant ? selectedVariant.price : product.price,
        quantity: quantity,
        image: selectedVariant && selectedVariant.images && selectedVariant.images.length > 0
          ? (typeof selectedVariant.images[0] === 'string' ? selectedVariant.images[0] : selectedVariant.images[0].image_path)
          : (product.images && product.images.length > 0 ? product.images[0].image_path : ""),
        attributes: selectedAttributes,
        slug: product.slug || ""
      }
      
      await addToCart(itemToAdd)

      toast({
        title: t("cart.added"),
        description: `${product.name} ${selectedVariant ? (selectedVariant.attributes?.color + ' / ' + selectedVariant.attributes?.size) : ''}`,
      })

    } catch (error) {
      console.error("Add to cart error", error)
      toast({
        title: "Error",
        description: "Could not add to cart",
        variant: "destructive"
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container px-4 md:px-8 mx-auto pt-32">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs uppercase tracking-widest mb-12 text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">{t("nav.home")}</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <Link href="/products" className="hover:text-black transition-colors">{t("products.title")}</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <span className="text-black font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Product Images - Sticky Grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {displayImagePaths.map((src, index) => (
                <div key={index} className="relative aspect-[3/4] bg-[#F0F0F0] overflow-hidden w-full">
                  <Image
                    src={src}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info - Sticky */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-2xl font-medium font-mono tracking-tighter">
                    {formatPrice(currentPrice)}
                  </span>
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-lg text-gray-400 line-through font-mono">
                      {formatPrice(currentOriginalPrice)}
                    </span>
                  )}
                </div>
                {currentStock <= 0 && (
                  <Badge className="bg-red-500 text-white rounded-none uppercase tracking-widest px-2 py-1 text-[10px]">
                    {t("product.outOfStock")}
                  </Badge>
                )}
                {currentStock > 0 && currentStock < 10 && (
                  <div className="text-orange-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center">
                    {t("product.onlyLeft").replace("{count}", currentStock.toString())}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-200 w-full" />

              <div className="space-y-6">
                {/* Attributes Selection */}
                {Object.entries(attributeOptions).map(([attributeName, values]) => (
                  <div key={attributeName}>
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-3">{attributeName}</h3>
                    <div className="flex gap-3 flex-wrap">
                      {Array.from(values).map((value) => {
                        const isSelected = selectedAttributes[attributeName] === value
                        const isAvailable = isVariantAvailable(attributeName, value)

                        return (
                          <button
                            key={value}
                            onClick={() => handleAttributeChange(attributeName, value)}
                            disabled={!isAvailable}
                            className={`
                                    min-w-[3rem] px-4 py-3 text-xs font-bold tracking-wider uppercase border border-black transition-all
                                    ${isSelected ? "bg-black text-white" : "bg-transparent text-black hover:bg-black hover:text-white"}
                                    ${!isAvailable ? "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-black border-gray-300" : ""}
                                `}
                          >
                            {formatAttributeValue(value)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity */}
                {currentStock > 0 && (
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-3">{t("product.quantity")}</h3>
                    <div className="flex items-center border border-black w-fit">
                      <button
                        className="px-4 py-3 hover:bg-black hover:text-white transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-6 py-3 font-mono font-bold text-sm min-w-[3rem] text-center border-l border-r border-black">
                        {quantity}
                      </span>
                      <button
                        className="px-4 py-3 hover:bg-black hover:text-white transition-colors"
                        onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                        disabled={quantity >= currentStock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1 rounded-none bg-black hover:bg-gray-800 text-white h-16 text-sm font-bold tracking-widest uppercase transition-all"
                  disabled={currentStock === 0 || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className={`mr-3 h-4 w-4 ${isAddingToCart ? 'animate-bounce' : ''}`} />
                  {isAddingToCart 
                    ? "ĐANG THÊM..." 
                    : (currentStock > 0 ? t("product.addToCollection") : t("product.soldOut"))}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`w-16 rounded-none border-black hover:bg-black hover:text-white h-16 ${
                    isInWishlist(product.id) ? "bg-black text-white" : "bg-transparent"
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="pt-8">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="description" className="border-t border-black/10">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-6">
                      {t("product.description")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-6 text-sm md:text-base">
                      <div className="whitespace-pre-line">{product.description}</div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="shipping" className="border-t border-black/10 border-b">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-6">
                      {t("product.shippingAndReturns")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-6 text-sm">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>{t("product.shippingPolicy")}</li>
                        <li>{t("product.internationalShipping")}</li>
                        <li>{t("product.returnPolicy")}</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 border-t border-black/10 pt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{t("product.youMayAlsoLike")}</h2>
            <Link href="/products" className="hidden md:inline-flex items-center border-b border-black pb-1 text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
              {t("product.viewAll")} <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <ProductSlider category_id={product.category_id} />
        </div>
      </div>
    </div>
  )
}
