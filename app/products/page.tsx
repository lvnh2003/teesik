"use client"

import { useState, useEffect } from "react"
import { Grid3X3, List, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ProductGrid from "@/components/product-grid"
import { Badge } from "@/components/ui/badge"
import { getCategories, getProducts } from "@/lib/admin-api"
import { Category, Product } from "@/type/product"


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(currentPage, 12),
          getCategories(),
        ])

        setProducts(productsResponse.data)
        setTotalPages(productsResponse.meta?.last_page || 1)
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.id === selectedCategory)
    : products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.variants?.[0]?.price || a.price) - (b.variants?.[0]?.price || b.price)
      case "price-high":
        return (b.variants?.[0]?.price || b.price) - (a.variants?.[0]?.price || a.price)
      case "newest":
        return new Date(b.id).getTime() - new Date(a.id).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">ALL PRODUCTS</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">Shop All</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of premium handbags designed for every lifestyle and occasion
          </p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              FILTERS
            </Button>
            <span className="text-sm text-gray-600">{sortedProducts.length} Products</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] border-black">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">FEATURED</SelectItem>
                <SelectItem value="newest">NEWEST</SelectItem>
                <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="space-y-8">
              <Accordion type="multiple" defaultValue={["category", "price"]}>
                <AccordionItem value="category" className="border-black">
                  <AccordionTrigger className="text-lg font-bold tracking-wider uppercase hover:no-underline">
                    CATEGORY
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="all-categories"
                          checked={selectedCategory === null}
                          onCheckedChange={() => setSelectedCategory(null)}
                        />
                        <label
                          htmlFor="all-categories"
                          className="text-sm font-medium tracking-wider uppercase cursor-pointer"
                        >
                          ALL CATEGORIES
                        </label>
                      </div>
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategory === category.id}
                            onCheckedChange={() => setSelectedCategory(category.id)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium tracking-wider uppercase cursor-pointer"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-black">
                  <AccordionTrigger className="text-lg font-bold tracking-wider uppercase hover:no-underline">
                    PRICE
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {["UNDER 500K", "500K - 1M", "1M - 1.5M", "OVER 1.5M"].map((price) => (
                        <div key={price} className="flex items-center space-x-3">
                          <Checkbox id={price.toLowerCase().replace(/\s/g, "-")} />
                          <label
                            htmlFor={price.toLowerCase().replace(/\s/g, "-")}
                            className="text-sm font-medium tracking-wider uppercase cursor-pointer"
                          >
                            {price}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-6"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid products={sortedProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
                      Previous
                    </Button>

                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = currentPage <= 3 ? index + 1 : currentPage - 2 + index
                      if (pageNum > totalPages) return null

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10 border-black text-black hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
