"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Product } from "@/type/product"
import { getProducts } from "@/lib/admin-api"
import ProductCard from "@/components/product-card"

interface ProductSliderProps {
  products?: Product[]
  category_id: number
}

export default function ProductSlider({ products: initialProducts, category_id}: ProductSliderProps) {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      const fetchProducts = async () => {
        setLoading(true)
        try {
          const { data } = await getProducts({category_id : category_id})
          setProducts(data)
        } catch (error) {
          console.error("Error fetching products for slider:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    } else {
      setProducts(initialProducts)
      setLoading(false)
    }
  }, [initialProducts])

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const scrollAmount = 320

      if (direction === "left") {
        sliderRef.current.scrollLeft = scrollLeft - scrollAmount
      } else {
        sliderRef.current.scrollLeft = scrollLeft + scrollAmount
      }

      // Check if we can scroll in either direction
      setTimeout(() => {
        if (sliderRef.current) {
          setShowLeftButton(sliderRef.current.scrollLeft > 0)
          setShowRightButton(sliderRef.current.scrollLeft < scrollWidth - clientWidth - 10)
        }
      }, 100)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500">Không có sản phẩm nào để hiển thị.</div>
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isSmall={false} />
        ))}
      </div>

      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/3 transform -translate-y-1/2 z-10 bg-white shadow-xl hover:bg-gray-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/3 transform -translate-y-1/2 z-10 bg-white shadow-xl hover:bg-gray-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
