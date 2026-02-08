"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MoveRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

import { useLanguage } from "@/contexts/language-context"

export default function CollectionsPage() {
  const { t } = useLanguage()

  const collections = [
    {
      id: 1,
      name: t("collection.summer"),
      description: t("collection.summerDesc"),
      image: "/images/collection-summer.jpg",
      slug: "summer",
      productCount: 24,
      featured: true,
    },
    {
      id: 2,
      name: t("collection.business"),
      description: t("collection.businessDesc"),
      image: "/images/collection-business.jpg",
      slug: "business",
      productCount: 18,
      featured: false,
    },
    {
      id: 3,
      name: t("collection.travel"),
      description: t("collection.travelDesc"),
      image: "/images/collection-travel.jpg",
      slug: "travel",
      productCount: 15,
      featured: false,
    },
    {
      id: 4,
      name: t("collection.new"),
      description: t("collection.newDesc"),
      image: "/images/tote-bag-1.jpg",
      slug: "new-arrivals",
      productCount: 32,
      featured: true,
    },
    {
      id: 5,
      name: t("collection.bestSellers"),
      description: t("collection.bestSellersDesc"),
      image: "/images/crossbody-bag-1.jpg",
      slug: "best-sellers",
      productCount: 20,
      featured: false,
    },
    {
      id: 6,
      name: t("collection.limited"),
      description: t("collection.limitedDesc"),
      image: "/images/backpack-1.jpg",
      slug: "limited-edition",
      productCount: 8,
      featured: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-black/10">
        <div className="container px-4 md:px-8 mx-auto">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[12vw] leading-none font-black tracking-tighter uppercase text-black mb-12 text-center md:text-left"
          >
            {t("collections.title")}
          </motion.h1>
          <div className="md:flex justify-end pr-4 md:pr-12">
            <p className="text-xl md:text-2xl font-medium max-w-xl leading-tight whitespace-pre-line">
              {t("collections.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/collections/${collection.slug}`} className="group block relative">
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-gray-200">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end items-start h-full">
                      <div className="bg-white/90 backdrop-blur-sm p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-3xl font-black tracking-tighter uppercase mb-0 leading-none">
                            {collection.name}
                          </h3>
                          <ArrowRight className="h-6 w-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <div className="h-px bg-black/10 w-full my-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <span className="text-sm font-bold uppercase tracking-widest">{collection.productCount} {t("collections.items")}</span>
                          <span className="text-xs uppercase tracking-widest text-gray-500">{t("collections.viewCollection")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase">{t("collections.customOrders")}</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            {t("collections.customOrdersDesc")}
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-neutral-200 px-12 py-8 text-lg font-bold tracking-widest uppercase rounded-none"
          >
            {t("collections.getInTouch")}
          </Button>
        </div>
      </section>
    </div>
  )
}
