"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PhotoSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Use temporary placeholder images or reuse existing ones
    const slides = [
        {
            image: "/images/hero-bag-1.jpg",
            alt: "Slide 1"
        },
        {
            image: "/images/hero-bag-2.jpg",
            alt: "Slide 2"
        },
        {
            image: "/images/hero-bag-3.jpg",
            alt: "Slide 3"
        },
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Next slide"
            >
                <ChevronRight className="h-8 w-8" />
            </button>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
