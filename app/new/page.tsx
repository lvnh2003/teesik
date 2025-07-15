"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductGridEnhanced from "@/components/product-grid-enhanced"
import { getImageUrl, getProducts } from "@/lib/admin-api"
import { Product } from "@/type/product"
import Loading from "../loading"

export default function NewPage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data } = await getProducts()
        setNewArrivals(data)
      } catch (error) {
        console.error("Error fetching new products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewProducts()
  }, [])

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">NEW ARRIVALS</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">What's New</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium handbags, fresh from our design studio
          </p>
        </div>
      </section>

      {/* Latest Releases */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-black uppercase">
              Latest Releases
            </h2>
            <p className="text-lg text-gray-600">Just dropped - our newest designs</p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {newArrivals.map((product) => {
                if(product.is_new === true){
                  const mainImage = product.images?.[0]
                  const imageUrl = mainImage ? getImageUrl(mainImage.image_path) : "/placeholder.svg"
  
                  return (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                      <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                        {product.is_featured && (
                          <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white hover:bg-red-600 text-xs tracking-wider">
                            HOT
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge className="absolute top-4 right-4 z-10 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
                            NEW
                          </Badge>
                        )}
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{product?.created_at ? formatDate(product.created_at) : ""}</span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                          {product.category?.name || "UNCATEGORIZED"}
                        </p>
                        <h3 className="text-lg font-bold tracking-tight uppercase group-hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-black">
                            {product.formatted_price || formatPrice(product.price)}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                }
                
              })}
            </div>
          )}

          {newArrivals.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Chưa có sản phẩm mới nào</p>
            </div>
          )}
        </div>
      </section>

      {/* All New Products */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-black uppercase">
              All New Products
            </h2>
            <p className="text-lg text-gray-600">Complete collection of our latest designs</p>
          </div>

          <ProductGridEnhanced products={newArrivals} />

          <div className="text-center mt-16">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="container px-4 mx-auto text-center">
          <Star className="h-16 w-16 text-white mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">Coming Soon</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know about our upcoming releases. Subscribe to get notified when new products drop.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-lg font-medium tracking-wider uppercase"
          >
            Notify Me
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
