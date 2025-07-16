"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Product } from "@/type/product"
import { getImageUrl } from "@/lib/admin-api"
import ProductCard from "./product-card"

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  const { t } = useLanguage()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có sản phẩm nào để hiển thị</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </div>
  )
}
