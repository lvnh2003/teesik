"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { getImageUrl, getProduct } from "@/lib/admin-api"
import type { Product } from "@/type/product"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, isLoading } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<{ [key: number]: Product }>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch product data for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = [...new Set(items.map(item => item.productId))]
      const productsData: { [key: number]: Product } = {}
      
      for (const productId of productIds) {
        try {
          const { data: product } = await getProduct(productId)
          productsData[productId] = product
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error)
        }
      }
      
      setProducts(productsData)
    }

    if (items.length > 0) {
      fetchProducts()
    }
  }, [items])

  // Format price in VND
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

  const subtotal = totalPrice
  const shipping = subtotal > 1000000 ? 0 : 50000
  const total = subtotal + shipping

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container px-4 mx-auto py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-6 p-6 border border-gray-200">
                  <div className="w-32 h-32 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container px-4 mx-auto py-20">
          <div className="text-center max-w-2xl mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-black uppercase">
              Giỏ hàng trống
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua sắm!
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                Bắt đầu mua sắm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 border-b border-gray-200">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">GIỎ HÀNG</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">Giỏ hàng của bạn</h1>
          <p className="text-xl text-gray-600">Kiểm tra sản phẩm và tiến hành thanh toán</p>
          <p className="text-sm text-gray-500 mt-2">
            {totalItems} {totalItems === 1 ? "sản phẩm" : "sản phẩm"} trong giỏ hàng
          </p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {items.map((item) => {
                const product = products[item.productId]
                if (!product) return null

                const currentPrice = item.variant?.price || 0
                const currentOriginalPrice = item.variant?.original_price || 0
                const currentImage = item.variant?.images?.[0]?.image_path || 
                                   product.main_image?.image_path || 
                                   product.images?.[0]?.image_path

                return (
                  <div key={item.id} className="flex gap-6 p-6 border border-gray-200 bg-gray-50">
                    <div className="relative w-32 h-32 bg-white rounded-lg overflow-hidden">
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
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-black tracking-tighter uppercase">{product.name}</h3>
                          {item.variant && (
                            <div className="text-sm text-gray-600 mt-1">
                              <p>SKU: {item.variant.sku}</p>
                              {Object.entries(item.variant.attributes).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {formatAttributeValue(value)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-l border-r border-gray-300 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{formatPrice(currentPrice * item.quantity)}</div>
                          {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(currentOriginalPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-medium tracking-wider uppercase bg-transparent"
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-8">
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && <p className="text-sm text-green-600">🎉 Bạn được miễn phí vận chuyển!</p>}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-sm font-medium tracking-wider uppercase mb-2">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nhập mã"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              <Link
                className="inline-flex items-center justify-center h-11 rounded-md bg-black px-6 text-lg font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wider w-full mb-4"
                href="/checkout"
              >
                Thanh toán
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <div className="text-center text-sm text-gray-600">
                <p>Thanh toán an toàn với mã hóa SSL</p>
                <p className="mt-2">Đổi trả miễn phí trong 30 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
