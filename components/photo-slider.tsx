"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { assetPath } from "@/lib/asset-path"

export default function PhotoSlider() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: assetPath("/images/hero-bag-1.jpg"),
      title: t("slides.genesis.title"),
      subtitle: t("slides.genesis.subtitle")
    },
    {
      image: assetPath("/images/hero-bag-2.jpg"),
      title: t("slides.urban.title"),
      subtitle: t("slides.urban.subtitle")
    },
    {
      image: assetPath("/images/hero-bag-3.jpg"),
      title: t("slides.silent.title"),
      subtitle: t("slides.silent.subtitle")
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[80vh] w-full bg-black overflow-hidden group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover opacity-80 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-12 md:p-24 pb-32">
        <div className="overflow-hidden mb-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/60 tracking-[0.5em] text-xs uppercase font-bold"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${currentSlide}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-5xl md:text-8xl font-serif italic text-white leading-none tracking-tighter"
            >
              {slides[currentSlide].title}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-12 right-12 z-20 flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative overflow-hidden h-1 rounded-full bg-white/20 transition-all duration-300"
              style={{ width: index === currentSlide ? "3rem" : "1rem" }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 bg-white"
                />
              )}
            </button>
          ))}
        </div>
        <div className="text-white text-sm font-mono tracking-widest hidden md:block">
          0{currentSlide + 1} / 0{slides.length}
        </div>
      </div>
    </div>
  )
}

