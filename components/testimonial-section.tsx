"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Chủ cửa hàng thời trang",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Tôi đã tìm kiếm một nhà cung cấp dropshipping túi xách chất lượng cao trong một thời gian dài. LUXEBAGS đã giúp tôi tăng doanh số bán hàng lên 200% chỉ trong 3 tháng với sản phẩm chất lượng và dịch vụ giao hàng nhanh chóng.",
      rating: 5,
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Người bán hàng trên Etsy",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      content:
        "Khách hàng của tôi rất hài lòng với chất lượng túi xách. Dịch vụ vận chuyển quốc tế nhanh chóng và đáng tin cậy. Tôi đặc biệt thích tính năng white label, giúp tôi xây dựng thương hiệu riêng một cách dễ dàng.",
      rating: 5,
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Chủ shop online",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
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
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
          <p className="text-gray-600 text-lg">Những phản hồi tích cực từ đối tác của chúng tôi</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mx-4">
                    <div className="flex flex-col items-center text-center">
                      <Quote className="h-12 w-12 text-gray-300 mb-6" />
                      <div className="flex mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full mr-4 shadow-lg"
                        />
                        <div className="text-left">
                          <h4 className="font-bold text-lg">{testimonial.name}</h4>
                          <p className="text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-black w-8" : "bg-gray-300 w-3 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-lg border-0"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-lg border-0"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
