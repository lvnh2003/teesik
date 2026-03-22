"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Product } from "@/type/product"
import { getImageUrl } from "@/services/core"
import ProductCard from "./product-card"
import { motion } from "framer-motion"

interface ProductGridProps {
  products?: Product[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
