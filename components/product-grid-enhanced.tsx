"use client"

import ProductCardEnhanced from "@/components/product-card-enhanced"
import { getImageUrl } from "@/lib/admin-api"
import { Product } from "@/type/product"

interface ProductGridEnhancedProps {
  products: Product[]
}

export default function ProductGridEnhanced({ products }: ProductGridEnhancedProps) {
  // Transform API products to match component expectations
  const transformedProducts = products.map((product) => {

    // Get main image
    const mainImage =
      product.images && product.images.length > 0
        ? getImageUrl(`${product.images[0].image_path}`)
        : "/placeholder.svg"

    // Get hover image (second image if available)
    const hoverImage =
      product.images && product.images.length > 1 ? getImageUrl(`${product.images[1].image_path}`) : undefined

    // Get price from first variant or product price
    const price = product.variants && product.variants.length > 0 ? product.variants[0].price : product.price

    const originalPrice =
      product.variants && product.variants.length > 0 ? product.variants[0].original_price : product.original_price

    return {
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
      image: mainImage,
      hoverImage: hoverImage,
      category: product.category?.name || "UNCATEGORIZED",
      isNew: product.is_new || false,
      slug: product.slug
    }
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {transformedProducts.map((product) => (
        <ProductCardEnhanced key={product.id} product={product} effectActive={true} variant="enhanced" />
      ))}
    </div>
  )
}
