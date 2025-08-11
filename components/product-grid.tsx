"use client"

import { Product } from "@/type/product"
import ProductCard from "./product-card"

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products = [] }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không có sản phẩm nào để hiển thị</p>
      </div>
    )
  }
  console.log("products", products);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </div>
  )
}
