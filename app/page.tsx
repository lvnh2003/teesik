"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Globe, Calendar, ArrowDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { getProducts } from "@/lib/admin-api"
import { Product } from "@/type/product"
import { motion, useScroll, useTransform } from "framer-motion"
import PhotoSlider from "@/components/photo-slider"

export default function Home() {
  const { t } = useLanguage()
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [newRes, featuredRes] = await Promise.all([
          getProducts({ is_new: 'true', per_page: 6 }),
          getProducts({ is_featured: 'true', per_page: 4 })
        ])
        setNewArrivals(newRes.data)
        setFeaturedProducts(featuredRes.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div ref={containerRef} className="bg-[#FDFBF7] text-black overflow-hidden">

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-between items-center px-4 pt-32 pb-12 sticky top-0 z-0">
        <motion.div style={{ y }} className="absolute inset-0 z-[-1] opacity-50">
          <div className="absolute inset-0 bg-[radial-gradient(#444444_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center flex-grow text-center"
        >
          <h1 className="text-[clamp(4rem,12vw,12rem)] leading-[0.85] font-black tracking-tighter uppercase mix-blend-difference text-black pb-4">
            Teesik
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-transparent">Objects</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl font-serif italic max-w-xl">
            "Defining the future of essentials through radical minimalism."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full flex justify-between items-end border-t border-black/10 pt-6"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{t("home.est")}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{t("home.scrollToExplore")}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{t("home.globalShipping")}</span>
            <Globe className="h-4 w-4" />
          </div>
        </motion.div>
      </section>

      {/* Marquee - Spacer */}
      <PhotoSlider />

      {/* Marquee - Spacer */}
      <div className="relative z-20 bg-black text-white py-4 overflow-hidden border-y border-white/10 shadow-xl">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-black uppercase tracking-widest mx-4">
              {t("home.marquee")}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content - White Background to cover Hero */}
      <div className="relative z-10 bg-[#FDFBF7] pt-32 pb-32 rounded-t-[3rem] shadow-2xl">

        {/* Intro Text */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] whitespace-pre-line">
              {t("home.heroMain")}
            </h2>
            <div className="text-lg md:text-xl leading-relaxed font-medium text-gray-800 space-y-6">
              <p>
                {t("home.heroDesc")}
              </p>
              <Link href="/about" className="inline-flex items-center text-black border-b border-black pb-1 hover:opacity-50 transition-opacity uppercase tracking-widest text-xs font-bold">
                {t("home.readPhilosophy")} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll - New Arrivals */}
        <section className="mb-32 overflow-hidden">
          <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
            <h3 className="text-4xl font-black uppercase tracking-tight">{t("home.latestDrops")}</h3>
            <Link href="/products?sort=newest" className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
              {t("home.viewAll")} <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-12 px-6 gap-8 snap-x snap-mandatory scrollbar-hide">
            {newArrivals.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="min-w-[80vw] md:min-w-[400px] snap-center group">
                <div className="relative aspect-[3/4] bg-[#F0F0F0] overflow-hidden mb-6">
                  <Image
                    src={product.main_image?.image_path ?
                      (product.main_image.image_path.startsWith('http') ? product.main_image.image_path : `/storage/${product.main_image.image_path}`)
                      : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full bg-white text-black hover:bg-black hover:text-white uppercase font-bold tracking-widest text-xs h-12">
                      {t("home.viewObject")}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black uppercase tracking-tight group-hover:underline">{product.name}</h4>
                  <span className="font-mono text-sm">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{product.category?.name || 'Unisex'}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Categories - Big Grid */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: t("home.toteBags"), img: "/images/tote-bag-1.jpg", link: "/collections/tote-bags", size: "col-span-1" },
              { name: t("footer.backpacks"), img: "/images/backpack-1.jpg", link: "/collections/backpacks", size: "col-span-1" },
              { name: t("home.accessories"), img: "/images/crossbody-bag-1.jpg", link: "/collections/accessories", size: "md:col-span-2 aspect-[2/1]" }

            ].map((cat, i) => (
              <Link key={i} href={cat.link} className={`relative group overflow-hidden ${cat.size} block`}>
                <div className={`relative w-full ${cat.size.includes('aspect') ? 'aspect-[2/1]' : 'aspect-square'} bg-gray-200`}>
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter text-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.name}
                    </h3>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="bg-white text-black px-6 py-2 uppercase font-bold tracking-widest text-xs">
                        {t("home.shopNow")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter - Minimal */}
        <section className="container mx-auto px-6 pt-20 border-t border-black/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
              {t("home.joinMovement")}
            </h2>
            <p className="text-xl text-gray-600 mb-12 font-serif italic">
              {t("home.newsletterDesc")}
            </p>
            <form className="flex flex-col md:flex-row gap-4 border-b border-black pb-4 focus-within:border-gray-500 transition-colors">
              <input
                type="email"
                placeholder={t("home.emailPlaceholder")}
                className="flex-grow bg-transparent border-none outline-none text-xl placeholder:text-gray-300 uppercase tracking-widest font-bold"
              />
              <button type="button" className="text-xl font-black uppercase tracking-tighter hover:text-gray-600 transition-colors">
                {t("home.subscribe")}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
