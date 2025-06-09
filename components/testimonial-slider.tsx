"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestimonialSlider() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Chủ cửa hàng thời trang",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "Tôi đã tìm kiếm một nhà cung cấp dropshipping túi xách chất lượng cao trong một thời gian dài. LUXEBAGS đã giúp tôi tăng doanh số bán hàng lên 200% chỉ trong 3 tháng với sản phẩm chất lượng và dịch vụ giao hàng nhanh chóng.",
      rating: 5,
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Người bán hàng trên Etsy",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "Khách hàng của tôi rất hài lòng với chất lượng túi xách. Dịch vụ vận chuyển quốc tế nhanh chóng và đáng tin cậy. Tôi đặc biệt thích tính năng white label, giúp tôi xây dựng thương hiệu riêng một cách dễ dàng.",
      rating: 5,
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Chủ shop online",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "API tích hợp dễ dàng với website của tôi, giúp tôi tự động hóa toàn bộ quy trình đặt hàng. Hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc. Đây là đối tác dropshipping tuyệt vời cho kinh doanh túi xách.",
      rating: 4,
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="rounded-full mb-4"
                    />
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? "bg-blue-600" : "bg-gray-300"
            } transition-colors`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}
