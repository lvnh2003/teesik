"use client"

import ProductCardEnhanced from "@/components/product-card-enhanced"

export default function ProductGridEnhanced() {
  const products = [
    {
      id: 1,
      name: "MILANO TOTE",
      price: 1290000,
      image: "/images/tote-bag-1.jpg",
      hoverImage: "/images/collection-business.jpg", // Ảnh thay đổi khi hover
      category: "TOTE BAGS",
      isNew: true,
      slug: "milano-tote",
    },
    {
      id: 2,
      name: "PARIS CROSSBODY",
      price: 890000,
      originalPrice: 1190000,
      image: "/images/crossbody-bag-1.jpg",
      hoverImage: "/images/collection-summer.jpg",
      category: "CROSSBODY",
      isNew: false,
      slug: "paris-crossbody",
    },
    {
      id: 3,
      name: "TOKYO BACKPACK",
      price: 1490000,
      image: "/images/backpack-1.jpg",
      hoverImage: "/images/collection-travel.jpg",
      category: "BACKPACKS",
      isNew: true,
      slug: "tokyo-backpack",
    },
    {
      id: 4,
      name: "NEW YORK CLUTCH",
      price: 690000,
      originalPrice: 990000,
      image: "/images/clutch-bag-1.jpg",
      category: "CLUTCHES",
      isNew: false,
      slug: "new-york-clutch",
    },
    {
      id: 5,
      name: "LONDON SHOULDER",
      price: 1190000,
      image: "/images/shoulder-bag-1.jpg",
      category: "SHOULDER BAGS",
      isNew: false,
      slug: "london-shoulder",
    },
    {
      id: 6,
      name: "BERLIN MESSENGER",
      price: 1390000,
      originalPrice: 1690000,
      image: "/images/messenger-bag-1.jpg",
      category: "MESSENGER",
      isNew: false,
      slug: "berlin-messenger",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
      {products.map((product) => (
        <ProductCardEnhanced key={product.id} product={product} effectActive={true} variant="enhanced" />
      ))}
    </div>
  )
}
