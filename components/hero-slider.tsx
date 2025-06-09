"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import HydrationWrapper from "@/components/hydration-wrapper"

export default function HeroSlider() {
  const { t, isLoaded } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Static slides for SSR
  const staticSlides = [
    {
      image: "/images/hero-bag-1.jpg",
      title: "SUMMER COLLECTION 2024",
      subtitle: "Túi xách cao cấp cho phong cách toàn cầu",
      buttonText: "Khám Phá Ngay",
      buttonLink: "/collections/summer",
    },
    {
      image: "/images/hero-bag-2.jpg",
      title: "NEW ARRIVALS",
      subtitle: "Khám phá những mẫu túi mới nhất của chúng tôi",
      buttonText: "Xem Bộ Sưu Tập",
      buttonLink: "/collections/new-arrivals",
    },
    {
      image: "/images/hero-bag-3.jpg",
      title: "DROPSHIPPING PROGRAM",
      subtitle: "Bắt đầu kinh doanh túi xách thời trang mà không cần tồn kho",
      buttonText: "Tham Gia Ngay",
      buttonLink: "/dropshipping",
    },
  ]

  // Dynamic slides for client
  const dynamicSlides = [
    {
      image: "/images/hero-bag-1.jpg",
      title: t("hero.title1"),
      subtitle: t("hero.subtitle1"),
      buttonText: t("hero.button1"),
      buttonLink: "/collections/summer",
    },
    {
      image: "/images/hero-bag-2.jpg",
      title: t("hero.title2"),
      subtitle: t("hero.subtitle2"),
      buttonText: t("hero.button2"),
      buttonLink: "/collections/new-arrivals",
    },
    {
      image: "/images/hero-bag-3.jpg",
      title: t("hero.title3"),
      subtitle: t("hero.subtitle3"),
      buttonText: t("hero.button3"),
      buttonLink: "/dropshipping",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === staticSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? staticSlides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  // Static fallback component
  const StaticHero = () => {
    const slide = staticSlides[0]
    return (
      <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />
        <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" priority />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-white leading-tight">
                SUMMER COLLECTION
                <br />
                <span className="font-medium italic">2024</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">{slide.subtitle}</p>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8"
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dynamic component
  const DynamicHero = () => {
    const slides = isLoaded ? dynamicSlides : staticSlides

    return (
      <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container px-4 mx-auto">
                <div className="max-w-2xl">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-white leading-tight">
                    {slide.title.split(" ").slice(0, -1).join(" ")}
                    <br />
                    <span className="font-medium italic">{slide.title.split(" ").slice(-1)}</span>
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">{slide.subtitle}</p>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-8 shadow-lg" : "bg-white/60 w-2 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <HydrationWrapper fallback={<StaticHero />}>
      <DynamicHero />
    </HydrationWrapper>
  )
}
