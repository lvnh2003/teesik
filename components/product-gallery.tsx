"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  const images = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Phantom X9 Pro - Góc nhìn chính diện",
      caption: "Thiết kế tinh tế với màu đen huyền bí",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Phantom X9 Pro - Góc nhìn bên",
      caption: "Đường cong mềm mại, tinh tế đến từng chi tiết",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Phantom X9 Pro - Góc nhìn trên",
      caption: "Bề mặt cảm ứng với điều khiển thông minh",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Phantom X9 Pro - Hộp sạc",
      caption: "Hộp sạc nhỏ gọn với thiết kế sang trọng",
    },
  ]

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>
        <Image
          src={images[activeIndex].src || "/placeholder.svg"}
          alt={images[activeIndex].alt}
          fill
          className="object-cover transition-transform duration-500"
        />
        <div className="absolute bottom-6 left-0 right-0 text-center z-20">
          <p className="text-lg font-medium">{images[activeIndex].caption}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-700 hover:bg-gray-800"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-rose-500" : "bg-gray-700"}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">Image {index + 1}</span>
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-700 hover:bg-gray-800"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-[4/3] rounded-md overflow-hidden ${
              index === activeIndex ? "ring-2 ring-rose-500" : "opacity-70"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
