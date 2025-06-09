"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function NewsletterSection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")
    }, 1000)
  }

  if (isSuccess) {
    return (
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 text-black mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-black uppercase">
              {t("newsletter.thankYou")}
            </h2>
            <p className="text-xl text-gray-600">{t("newsletter.success")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="container px-4 mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-black uppercase">
            {t("newsletter.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-12">{t("newsletter.subtitle")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 px-6 border-2 border-black focus:border-black text-lg font-medium"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 h-14 text-lg font-medium tracking-wider uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
