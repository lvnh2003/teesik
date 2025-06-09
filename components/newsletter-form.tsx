"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import HydrationWrapper from "@/components/hydration-wrapper"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const { t, isLoaded } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")
    }, 1000)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  // Static fallback
  const StaticForm = () => (
    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="email"
          placeholder="Email của bạn"
          className="pl-12 h-12 border-2 border-gray-200 focus:border-gray-900 rounded-xl shadow-lg"
          required
        />
      </div>
      <Button
        type="button"
        className="h-12 px-8 bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
      >
        ĐĂNG KÝ
      </Button>
    </form>
  )

  // Dynamic form
  const DynamicForm = () => {
    if (isSuccess) {
      return (
        <div className="bg-gray-50 border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-gray-700" />
          </div>
          <p className="font-bold text-lg text-center mb-2">Cảm ơn bạn đã đăng ký!</p>
          <p className="text-center text-gray-700">Chúng tôi sẽ gửi những thông tin mới nhất đến email của bạn.</p>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="email"
            placeholder={isLoaded ? t("common.emailPlaceholder") : "Email của bạn"}
            value={email}
            onChange={handleEmailChange}
            className="pl-12 h-12 border-2 border-gray-200 focus:border-gray-900 rounded-xl shadow-lg"
            required
          />
        </div>
        <Button
          type="submit"
          className="h-12 px-8 bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng ký..." : isLoaded ? t("common.newsletter").toUpperCase() : "ĐĂNG KÝ"}
        </Button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    )
  }

  return (
    <HydrationWrapper fallback={<StaticForm />}>
      <DynamicForm />
    </HydrationWrapper>
  )
}
