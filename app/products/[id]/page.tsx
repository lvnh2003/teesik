"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Heart, Share2, ShoppingBag, Truck, RotateCcw, Shield, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ProductSlider from "@/components/product-slider"
import { getImageUrl, getProduct } from "@/lib/admin-api"
import type { Product, ProductImage, ProductVariant } from "@/type/product"
import Loading from "@/app/(site)/loading"
import { useParams } from "next/navigation";
export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({})
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]) 
  const params = useParams();
  const id = params.id as string
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData } = await getProduct(Number(id))
        console.log("Product data received:", productData)
        setProduct(productData)

        // Set default variant and attributes
        if (productData && productData.variants && productData.variants.length > 0) {
          const firstVariant = productData.variants[0]
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
  }, [])

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
      <Loading/>
    )
  }

  if (!product) {
    return (
      <div className="container px-4 mx-auto py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link href="/products">
          <Button>Quay lại danh sách sản phẩm</Button>
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

    console.log("Display images:", uniqueImages)
    return uniqueImages
  }

  const displayImages = getDisplayImages()
  const currentImage = displayImages[selectedImageIndex]?.image_path
    ? getImageUrl(displayImages[selectedImageIndex].image_path)
    : "/placeholder.svg?height=600&width=600"

  // Get unique attributes from all variants
  const attributeOptions = (product.variants || []).reduce(
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
    const matchingVariant = product.variants?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(newAttributes).every(([key, val]) => variant.attributes[key] === val)
    })

    if (matchingVariant) {
      console.log("Selected variant:", matchingVariant)
      setSelectedVariant(matchingVariant)
    }
  }

  // Check if variant is available (has stock)
  const isVariantAvailable = (attributeName: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attributeName]: value }
    const matchingVariant = product.variants?.find((variant) => {
      if (!variant.attributes) return false
      return Object.entries(testAttributes).every(([key, val]) => variant.attributes[key] === val)
    })
    return matchingVariant && matchingVariant.stock_quantity > 0
  }

  const currentPrice = selectedVariant?.price || product.price
  const currentOriginalPrice = selectedVariant?.original_price || product.original_price
  const currentStock = selectedVariant?.stock_quantity || product.stock_quantity || 0
  const discountPercentage =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : null

  return (
    <div className="container px-4 mx-auto py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-black">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-500 hover:text-black">
          Sản phẩm
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={displayImages[selectedImageIndex]?.alt_text || product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.is_new && <Badge className="bg-black text-white hover:bg-black">NEW</Badge>}
              {discountPercentage && (
                <Badge className="bg-red-500 text-white hover:bg-red-500">-{discountPercentage}%</Badge>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {displayImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className={`relative aspect-square bg-neutral-100 cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index ? "border-black" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={getImageUrl(image.image_path) || "/placeholder.svg"}
                    alt={image.alt_text || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-black">{formatPrice(currentPrice)}</span>
              {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(currentOriginalPrice)}</span>
              )}
            </div>

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
            </div>
          </div>

          {/* Attributes Selection */}
          {Object.entries(attributeOptions).map(([attributeName, values]) => (
            <div key={attributeName}>
              <h3 className="font-semibold mb-3 text-lg capitalize">{attributeName}</h3>
              <div className="flex gap-2 flex-wrap">
                {Array.from(values).map((value) => {
                  const isSelected = selectedAttributes[attributeName] === value
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

          {/* Quantity */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-black hover:bg-neutral-800 text-white flex-1 h-14 text-lg font-semibold"
              disabled={currentStock === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {currentStock > 0 ? "THÊM VÀO GIỎ" : "HẾT HÀNG"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white bg-transparent h-14"
            >
              <Heart className="mr-2 h-5 w-5" />
              YÊU THÍCH
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white bg-transparent h-14 px-4"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Features */}
          <div className="border-t border-b border-gray-200 py-6 space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <h4 className="font-semibold">Miễn phí vận chuyển</h4>
                <p className="text-gray-600 text-sm">Cho đơn hàng trên 1.000.000đ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
              <div>
                <h4 className="font-semibold">Đổi trả miễn phí</h4>
                <p className="text-gray-600 text-sm">Trong vòng 30 ngày</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 flex-shrink-0 text-purple-600" />
              <div>
                <h4 className="font-semibold">Bảo hành 1 năm</h4>
                <p className="text-gray-600 text-sm">Cho các lỗi từ nhà sản xuất</p>
              </div>
            </div>
          </div>

          {/* Product Meta */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">SKU:</span> {selectedVariant?.sku || product.sku || "N/A"}
            </p>
            <p>
              <span className="font-medium">Danh mục:</span> {product.category?.name || "Chưa phân loại"}
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold"
            >
              Tất cả biến thể
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-semibold"
            >
              Vận chuyển & Đổi trả
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-8">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</div>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="pt-8">
            <div className="grid gap-4 md:grid-cols-2">
              {product.variants?.map((variant) => (
                <div
                  key={variant.id}
                  className={`border-2 rounded-lg p-6 transition-all ${
                    selectedVariant?.id === variant.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">SKU: {variant.sku}</h4>
                      {variant.attributes && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {formatAttributeValue(value)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatPrice(variant.price)}</div>
                      {variant.original_price && variant.original_price > variant.price && (
                        <div className="text-sm text-gray-500 line-through">{formatPrice(variant.original_price)}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {variant.stock_quantity > 0 ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">Còn {variant.stock_quantity} sản phẩm</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-600 font-medium">Hết hàng</span>
                        </>
                      )}
                    </div>

                    {selectedVariant?.id === variant.id && <Badge className="bg-black text-white">Đang chọn</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="pt-8">
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-xl text-black mb-4">Chính sách vận chuyển</h3>
                <p className="mb-4">
                  Chúng tôi cung cấp dịch vụ vận chuyển toàn quốc và quốc tế. Đơn hàng sẽ được xử lý trong vòng 1-2 ngày
                  làm việc.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ</li>
                  <li>Phí vận chuyển nội thành: 30.000đ</li>
                  <li>Phí vận chuyển các tỉnh: 40.000đ - 60.000đ</li>
                  <li>Vận chuyển quốc tế: Tùy thuộc vào quốc gia đích</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-xl text-black mb-4">Chính sách đổi trả</h3>
                <p className="mb-4">
                  Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng, với điều kiện sản phẩm
                  còn nguyên vẹn, chưa qua sử dụng và còn đầy đủ tem mác, nhãn hiệu và hộp đựng.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng</li>
                  <li>Còn đầy đủ tem mác, nhãn hiệu và hộp đựng</li>
                  <li>Có hóa đơn mua hàng hoặc biên lai thanh toán</li>
                  <li>Phí vận chuyển đổi trả do khách hàng chi trả</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
        <ProductSlider category_id={product.category_id}/>
      </div>
    </div>
  )
}
