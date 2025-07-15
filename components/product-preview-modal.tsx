"use client"

import { Key, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Star, Tag, Package, Truck, ShieldCheck, ExternalLink } from "lucide-react"
import type { Product } from "@/lib/admin-api"

interface ProductPreviewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductPreviewModal({ product, isOpen, onClose }: ProductPreviewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("details")

  if (!product) return null
  console.log(product);
  

  const hasVariants = product.variants && product.variants.length > 0
  const discountPercentage =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null

  const handlePrevImage = () => {
    if (!product.images || product.images.length <= 1) return
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!product.images || product.images.length <= 1) return
    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Xem trước sản phẩm</DialogTitle>
          <DialogDescription>Xem trước sản phẩm như hiển thị trên trang web</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={`http://localhost:8000/storage/${product.images[activeImageIndex].image_path}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {product.is_new && <Badge className="absolute top-2 left-2 bg-blue-500">Mới</Badge>}

              {discountPercentage && (
                <Badge className="absolute top-2 right-2 bg-red-500">-{discountPercentage}%</Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      activeImageIndex === index ? "border-primary" : "border-muted"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={`http://localhost:8000/storage/${image.image_path}`}
                      alt={`${product.name} - Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 đánh giá)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
              )}
            </div>

            {product.stock_quantity > 0 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Còn hàng
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Hết hàng
              </Badge>
            )}

            {product.sku && (
              <div className="text-sm text-muted-foreground">
                SKU: <span className="font-mono">{product.sku}</span>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                {hasVariants && <TabsTrigger value="variants">Biến thể</TabsTrigger>}
                <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4 space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>{product.description}</p>
                </div>

                {product.category && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Danh mục: {product.category.name}</span>
                  </div>
                )}
              </TabsContent>
              {hasVariants && (
                <TabsContent value="variants" className="pt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Các biến thể sản phẩm</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {product.variants?.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            {variant.images && variant.images.length > 0 ? (
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                                <Image
                                  src={
                                    "image_path" in variant.images[0]
                                      ? `http://localhost:8000/storage/${(variant.images[0] as any).image_path}`
                                      : ""
                                  }
                                  alt={variant.sku || ""}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <div className="flex gap-1 flex-wrap">
                                {Array.isArray(variant.attributes) &&
                                  variant.attributes.map((attr: string, idx: Key | null | undefined) => {
                                    let parsed = {};
                                    try {
                                      parsed = typeof attr === "string" ? JSON.parse(attr) : {};
                                    } catch (e) {
                                      parsed = { name: "?", value: "?" };
                                    }
                                    return (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {(parsed && typeof parsed === "object" && "name" in parsed && "value" in parsed)
                                          ? `${parsed.name}: ${parsed.value}`
                                          : "? : ?"}
                                      </Badge>
                                    );
                                  })}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                SKU: <span className="font-mono">{variant.sku}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(variant.price)}</div>
                            <div className="text-xs text-muted-foreground">
                              Tồn kho: {variant.stock_quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}


              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vận chuyển</h4>
                      <p className="text-sm text-muted-foreground mt-1">Giao hàng toàn quốc từ 2-5 ngày làm việc</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Bảo hành</h4>
                      <p className="text-sm text-muted-foreground mt-1">Bảo hành 12 tháng chính hãng</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Xem trên trang web
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
