"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/admin-api"
import { Product } from "@/type/product"
import Loading from "@/app/loading"
import ProductGrid from "@/components/product-grid"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export default function NewPage() {
  const { t } = useLanguage()
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data } = await getProducts({ status: 'new' })
        setNewArrivals(data)
      } catch (error) {
        console.error("Error fetching new products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewProducts()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-black/10">
        <div className="container px-4 md:px-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-black text-white hover:bg-black rounded-none text-xs uppercase tracking-widest px-3 py-1">
                {t("new.latestDrop")}
              </Badge>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 animate-pulse">
                {t("new.justLanded")}
              </span>
            </div>
            <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase text-black mb-12 whitespace-pre-line">
              {t("new.title")}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-800 max-w-2xl leading-tight">
              {t("new.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-black/10 bg-black text-white py-4">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-bold uppercase tracking-[0.2em]">
              {t("new.marquee")}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-8 mx-auto">
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
                    {t("new.theLatest")}
                  </h2>
                  <p className="text-lg text-gray-500 font-medium max-w-md">
                    {t("new.latestDesc")}
                  </p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("products.objectsFound")}</p>
                  <p className="text-4xl font-black font-mono">{newArrivals.length}</p>
                </div>
              </div>

              <ProductGrid products={newArrivals} />

              {newArrivals.length === 0 && (
                <div className="text-center py-32 border border-dashed border-black/20">
                  <p className="text-gray-400 text-xl font-medium uppercase tracking-widest">{t("new.noItems")}</p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-24">
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-black text-black hover:bg-black hover:text-white px-12 py-8 text-sm font-bold tracking-widest uppercase rounded-none transition-all"
              >
                {t("new.viewFull")}
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / Coming Soon */}
      <section className="py-24 bg-black text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
          <Star className="w-96 h-96" />
        </div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-none whitespace-pre-line">
              {t("newsletter.dontMiss")}
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl font-light">
              {t("newsletter.subtitle")}
            </p>
            <div className="max-w-md flex border-b border-white pb-2">
              <input
                type="email"
                placeholder={t("home.emailPlaceholder")}
                className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 w-full text-lg font-bold uppercase tracking-widest"
              />
              <button className="text-white hover:text-gray-300 font-bold uppercase tracking-widest text-sm flex-shrink-0">
                {t("home.subscribe")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
