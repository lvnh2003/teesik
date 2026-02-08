"use client"

import { useState, useEffect } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCard from "@/components/product-card"
import { getCategories, getProducts } from "@/lib/admin-api"
import { Category, Product } from "@/type/product"
import { motion, AnimatePresence } from "framer-motion"

import { useLanguage } from "@/contexts/language-context"

export default function ProductsPage() {
  const { t } = useLanguage()
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
          getProducts({ page: currentPage, per_page: 12 }),
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

  // Filter Component Content
  const FilterContent = () => (
    <div className="space-y-8 py-6">
      <Accordion type="multiple" defaultValue={["category", "price"]}>
        <AccordionItem value="category" className="border-black/10">
          <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
            {t("filter.category")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="all-categories"
                  checked={selectedCategory === null}
                  onCheckedChange={() => setSelectedCategory(null)}
                  className="rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <label
                  htmlFor="all-categories"
                  className="text-sm font-medium uppercase cursor-pointer text-gray-600 hover:text-black transition-colors"
                >
                  {t("filter.allCategories")}
                </label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => setSelectedCategory(category.id)}
                    className="rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium uppercase cursor-pointer text-gray-600 hover:text-black transition-colors"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-black/10">
          <AccordionTrigger className="text-sm font-bold tracking-wider uppercase hover:no-underline">
            {t("filter.priceRange")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-4">
              {[
                { label: t("filter.under500k"), value: "Under 500k" },
                { label: t("filter.500k1m"), value: "500k - 1m" },
                { label: t("filter.1m15m"), value: "1m - 1.5m" },
                { label: t("filter.over15m"), value: "Over 1.5m" }
              ].map((priceItem) => (
                <div key={priceItem.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={priceItem.value.toLowerCase().replace(/\s/g, "-")}
                    className="rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                  <label
                    htmlFor={priceItem.value.toLowerCase().replace(/\s/g, "-")}
                    className="text-sm font-medium uppercase cursor-pointer text-gray-600 hover:text-black transition-colors"
                  >
                    {priceItem.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Editorial Header */}
      <header className="pt-32 pb-12 px-4 md:px-8 border-b border-black/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1920px] mx-auto">
          <div>
            <h1 className="text-[10vw] md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-4 whitespace-pre-line">
              {t("products.title")}
            </h1>
            <p className="text-gray-500 max-w-md font-medium text-sm md:text-base">
              {t("products.description")}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xs uppercase tracking-widest mb-2">
              {sortedProducts.length} {t("products.objectsFound")}
            </span>
          </div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="uppercase font-bold tracking-widest text-xs hover:bg-transparent hover:text-gray-600 pl-0">
                <Filter className="mr-2 h-4 w-4" /> {t("products.filterSort")}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r border-black/10 pt-16">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-2xl font-black uppercase tracking-tighter">{t("products.refineSelection")}</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-none bg-transparent font-bold text-xs uppercase tracking-widest focus:ring-0 shadow-none text-right">
                <SelectValue placeholder={t("products.sortBy")} />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-none border-black/10">
                <SelectItem value="featured" className="uppercase text-xs font-medium tracking-wider">{t("sort.featured")}</SelectItem>
                <SelectItem value="newest" className="uppercase text-xs font-medium tracking-wider">{t("sort.newest")}</SelectItem>
                <SelectItem value="price-low" className="uppercase text-xs font-medium tracking-wider">{t("sort.priceLowHigh")}</SelectItem>
                <SelectItem value="price-high" className="uppercase text-xs font-medium tracking-wider">{t("sort.priceHighLow")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-16">
        {loading ? (
          // ... keep loading skeleton ...
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 mb-4"></div>
                <div className="h-4 bg-gray-100 w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-100 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-24 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-none border-black hover:bg-black hover:text-white uppercase text-xs font-bold tracking-widest px-8"
                >
                  {t("pagination.previous")}
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = currentPage <= 3 ? index + 1 : currentPage - 2 + index
                    if (pageNum > totalPages) return null

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold font-mono transition-colors ${currentPage === pageNum
                          ? "bg-black text-white"
                          : "text-gray-400 hover:text-black"
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-none border-black hover:bg-black hover:text-white uppercase text-xs font-bold tracking-widest px-8"
                >
                  {t("pagination.next")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
