import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      name: "SUMMER COLLECTION",
      description: "Lightweight designs perfect for warm weather adventures",
      image: "/images/collection-summer.jpg",
      slug: "summer",
      productCount: 24,
      featured: true,
    },
    {
      id: 2,
      name: "BUSINESS COLLECTION",
      description: "Professional bags for the modern workplace",
      image: "/images/collection-business.jpg",
      slug: "business",
      productCount: 18,
      featured: false,
    },
    {
      id: 3,
      name: "TRAVEL COLLECTION",
      description: "Durable and functional bags for your journeys",
      image: "/images/collection-travel.jpg",
      slug: "travel",
      productCount: 15,
      featured: false,
    },
    {
      id: 4,
      name: "NEW ARRIVALS",
      description: "Latest designs and trending styles",
      image: "/images/tote-bag-1.jpg",
      slug: "new-arrivals",
      productCount: 32,
      featured: true,
    },
    {
      id: 5,
      name: "BEST SELLERS",
      description: "Our most popular and loved designs",
      image: "/images/crossbody-bag-1.jpg",
      slug: "best-sellers",
      productCount: 20,
      featured: false,
    },
    {
      id: 6,
      name: "LIMITED EDITION",
      description: "Exclusive designs in limited quantities",
      image: "/images/backpack-1.jpg",
      slug: "limited-edition",
      productCount: 8,
      featured: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">COLLECTIONS</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">
            Our Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections designed for every lifestyle, occasion, and personal style
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-black uppercase">
              Featured Collections
            </h2>
            <p className="text-lg text-gray-600">Our most popular and trending collections</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {collections
              .filter((collection) => collection.featured)
              .map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.slug}`} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <Badge className="bg-white text-black hover:bg-gray-100 mb-4">
                        {collection.productCount} PRODUCTS
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-tighter mb-2 text-black uppercase group-hover:text-gray-600 transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <div className="flex items-center text-black font-medium group-hover:text-gray-600 transition-colors">
                    EXPLORE COLLECTION
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* All Collections */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-black uppercase">
              All Collections
            </h2>
            <p className="text-lg text-gray-600">Browse our complete range of collections</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group">
                <div className="flex bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative w-1/3 aspect-square">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <Badge className="bg-black text-white hover:bg-gray-800 mb-4 w-fit">
                      {collection.productCount} PRODUCTS
                    </Badge>
                    <h3 className="text-2xl font-black tracking-tighter mb-3 text-black uppercase group-hover:text-gray-600 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{collection.description}</p>
                    <div className="flex items-center text-black font-medium group-hover:text-gray-600 transition-colors">
                      VIEW COLLECTION
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">Can't Find What You Need?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our team for custom designs or special requests. We're here to help you find the perfect bag.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-lg font-medium tracking-wider uppercase"
          >
            Contact Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
