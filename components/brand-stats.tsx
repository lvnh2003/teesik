"use client"

import { useLanguage } from "@/contexts/language-context"

export default function BrandStats() {
  const { t } = useLanguage()

  const stats = [
    {
      number: "50K+",
      label: t("stats.customers"),
    },
    {
      number: "100+",
      label: t("stats.countries"),
    },
    {
      number: "500+",
      label: t("stats.designs"),
    },
    {
      number: "24/7",
      label: t("stats.support"),
    },
  ]

  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-black">{stat.number}</div>
              <div className="text-sm font-medium tracking-wider uppercase text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
