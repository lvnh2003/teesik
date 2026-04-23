"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Globe, Calendar, ArrowDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { ProductService } from "@/services/products"
import { Product, Category } from "@/type/product"
import { motion, useScroll, useTransform } from "framer-motion"
import PhotoSlider from "@/components/photo-slider"

export default function Home() {
  const { t } = useLanguage()
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const formatCategoryName = (name: string) => {
    const lower = name.toLowerCase();
    if (lower === 'quần ảos') return 'QUẦN ÁO';
    if (lower === 'túi sách') return 'TÚI XÁCH';
    return name;
  }
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [newRes, featuredRes, catRes] = await Promise.all([
          ProductService.getProducts({ is_new: 'true', per_page: 6 }),
          ProductService.getProducts({ is_featured: 'true', per_page: 4 }),
          ProductService.getCategories()
        ])
        setNewArrivals(newRes.data)
        setFeaturedProducts(featuredRes.data)
        setCategories(catRes.data)
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
            {t("home.heroSlogan")}
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
              <Link key={product.id} href={`/products/detail?id=${product.id}`} className="min-w-[80vw] md:min-w-[400px] snap-center group">
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
            {categories.slice(0, 3).map((cat, i) => {
              const size = i === 2 ? "md:col-span-2 aspect-[2/1]" : "col-span-1";
              return (
              <Link key={cat.id} href={`/products`} className={`relative group overflow-hidden ${size} block`}>
                <div className={`relative w-full ${size.includes('aspect') ? 'aspect-[2/1]' : 'aspect-square'} bg-gray-200`}>
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                     <span className="text-white opacity-20 text-xs">{t("home.imagePlaceholder")}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter text-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {formatCategoryName(cat.name)}
                    </h3>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="bg-white text-black px-6 py-2 uppercase font-bold tracking-widest text-xs">
                        {t("home.shopNow")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>

        {/* Fullwidth Video Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden mb-0">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/bag-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-center mix-blend-overlay">
              {t("home.videoText")}
            </h2>
          </div>
        </section>



        {/* Manifesto / Typography Spacer */}
        <section className="container mx-auto px-6 py-32 md:py-48 flex flex-col items-center justify-center text-center">
          <div className="w-px h-16 bg-black/20 mb-12"></div>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif italic max-w-4xl leading-[1.3] text-black">
            {t("home.manifestoQuote")}
          </h3>
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.4em] text-black/40">
            {t("home.manifestoAuthor")}
          </p>
          <div className="w-px h-16 bg-black/20 mt-12"></div>
        </section>

        {/* Cinematic Finale */}
        <section className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center bg-black">
          <div className="absolute inset-0 z-0">
             <Image
               src="/images/hero-bag-3.jpg"
               alt="Cinematic Background"
               fill
               className="object-cover opacity-60 mix-blend-luminosity scale-105 hover:scale-100 transition-transform duration-[10s]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 text-white text-center flex flex-col items-center">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.8em] text-white/70 mb-8 font-bold">
              {t("home.cinematicSubtitle")}
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic mb-12 max-w-6xl leading-[1.1] text-white drop-shadow-2xl">
              {t("home.cinematicTitle")}
            </h2>
            <div className="w-px h-16 md:h-24 bg-white/40 mb-12"></div>
            <Link href="/products" className="inline-block border border-white/40 px-10 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-500 backdrop-blur-sm">
              {t("home.cinematicExplore")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
