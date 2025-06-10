import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductGridEnhanced from "@/components/product-grid-enhanced"

export default function NewPage() {
  const newArrivals = [
    {
      id: 1,
      name: "SEOUL MINI BAG",
      price: 790000,
      image: "/images/clutch-bag-1.jpg",
      category: "MINI BAGS",
      releaseDate: "2024-01-15",
      isHot: true,
    },
    {
      id: 2,
      name: "STOCKHOLM TOTE",
      price: 1590000,
      image: "/images/tote-bag-1.jpg",
      category: "TOTE BAGS",
      releaseDate: "2024-01-10",
      isHot: false,
    },
    {
      id: 3,
      name: "COPENHAGEN CROSSBODY",
      price: 990000,
      image: "/images/crossbody-bag-1.jpg",
      category: "CROSSBODY",
      releaseDate: "2024-01-08",
      isHot: true,
    },
  ]

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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {newArrivals.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                  {item.isHot && (
                    <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white hover:bg-red-600 text-xs tracking-wider">
                      HOT
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 z-10 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
                    NEW
                  </Badge>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.releaseDate)}</span>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{item.category}</p>
                  <h3 className="text-lg font-bold tracking-tight uppercase group-hover:text-gray-600 transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-lg font-bold text-black">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
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

          <ProductGridEnhanced />

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
