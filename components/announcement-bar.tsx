"use client"

import { useState } from "react"
import { X, Truck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AnnouncementBar() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-black text-white py-3 px-4 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        <span className="text-sm font-medium tracking-wider uppercase">{t("announcement.freeShipping")}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
