"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { assetPath } from "@/lib/asset-path"

export default function HeroSection() {
  const { t } = useLanguage()
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    assetPath("/images/hero-bag-1.jpg"),
    assetPath("/images/hero-bag-2.jpg"),
    assetPath("/images/hero-bag-3.jpg"),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-20" : "opacity-0"
              }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Hero Background"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-black leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            TEE
            <br />
            <span className="text-gray-400">SIK</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                {t("hero.shopCollection")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/dropshipping">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                {t("hero.startDropshipping")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
