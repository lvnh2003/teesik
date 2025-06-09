"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductGrid from "@/components/product-grid"
import CollectionBanner from "@/components/collection-banner"
import NewsletterSection from "@/components/newsletter-section"
import AnnouncementBar from "@/components/announcement-bar"
import HeroSection from "@/components/hero-section"
import BrandStats from "@/components/brand-stats"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Brand Stats */}
      <BrandStats />

      {/* New Arrivals */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">NEW ARRIVALS</Badge>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-black uppercase">
              {t("common.latestDrops")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("common.discoverNewest")}</p>
          </div>

          <ProductGrid />

          <div className="text-center mt-16">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                {t("common.viewAll")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Banner */}
      <CollectionBanner />

      {/* Featured Categories */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-black uppercase">
              {t("category.shopByCategory")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("category.findPerfect")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "TOTE BAGS",
                image: "/images/tote-bag-1.jpg",
                description: t("category.toteDesc"),
                link: "/collections/tote-bags",
              },
              {
                name: "CROSSBODY",
                image: "/images/crossbody-bag-1.jpg",
                description: t("category.crossbodyDesc"),
                link: "/collections/crossbody",
              },
              {
                name: "BACKPACKS",
                image: "/images/backpack-1.jpg",
                description: t("category.backpackDesc"),
                link: "/collections/backpacks",
              },
            ].map((category, index) => (
              <Link key={index} href={category.link} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2 text-black uppercase group-hover:text-gray-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-black font-medium group-hover:text-gray-600 transition-colors">
                  {t("category.shopNow")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  )
}
