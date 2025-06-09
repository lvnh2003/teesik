import { Grid3X3, List, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ProductGrid from "@/components/product-grid"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "MILANO TOTE",
      price: 1290000,
      image: "/images/tote-bag-1.jpg",
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
      category: "CROSSBODY",
      isNew: false,
      slug: "paris-crossbody",
    },
    {
      id: 3,
      name: "TOKYO BACKPACK",
      price: 1490000,
      image: "/images/backpack-1.jpg",
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
    {
      id: 7,
      name: "ROME HANDBAG",
      price: 1590000,
      image: "/images/tote-bag-1.jpg",
      category: "HANDBAGS",
      isNew: true,
      slug: "rome-handbag",
    },
    {
      id: 8,
      name: "SEOUL MINI BAG",
      price: 790000,
      image: "/images/clutch-bag-1.jpg",
      category: "MINI BAGS",
      isNew: false,
      slug: "seoul-mini-bag",
    },
  ]

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
            <Button variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              FILTERS
            </Button>
            <span className="text-sm text-gray-600">{products.length} Products</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[200px] border-black">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">FEATURED</SelectItem>
                <SelectItem value="newest">NEWEST</SelectItem>
                <SelectItem value="price-low">PRICE: LOW TO HIGH</SelectItem>
                <SelectItem value="price-high">PRICE: HIGH TO LOW</SelectItem>
                <SelectItem value="bestselling">BEST SELLING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="space-y-8">
              <Accordion type="multiple" defaultValue={["category", "price", "color"]}>
                <AccordionItem value="category" className="border-black">
                  <AccordionTrigger className="text-lg font-bold tracking-wider uppercase hover:no-underline">
                    CATEGORY
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {["TOTE BAGS", "CROSSBODY", "BACKPACKS", "CLUTCHES", "SHOULDER BAGS", "MESSENGER"].map(
                        (category) => (
                          <div key={category} className="flex items-center space-x-3">
                            <Checkbox id={category.toLowerCase()} />
                            <label
                              htmlFor={category.toLowerCase()}
                              className="text-sm font-medium tracking-wider uppercase cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ),
                      )}
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

                <AccordionItem value="color" className="border-black">
                  <AccordionTrigger className="text-lg font-bold tracking-wider uppercase hover:no-underline">
                    COLOR
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {["BLACK", "BROWN", "NAVY", "BEIGE", "WHITE"].map((color) => (
                        <div key={color} className="flex items-center space-x-3">
                          <Checkbox id={color.toLowerCase()} />
                          <label
                            htmlFor={color.toLowerCase()}
                            className="text-sm font-medium tracking-wider uppercase cursor-pointer"
                          >
                            {color}
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
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>
  )
}
