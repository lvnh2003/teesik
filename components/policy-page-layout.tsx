"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface PolicySection {
  titleKey: string
  introKey?: string
  textKey?: string
  items?: string[]
}

interface PolicyPageLayoutProps {
  titleKey: string
  introKey: string
  sections: PolicySection[]
}

export default function PolicyPageLayout({ titleKey, introKey, sections }: PolicyPageLayoutProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black pt-24 pb-16">
      <div className="container px-4 md:px-8 mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("policy.home")}
        </Link>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">{t(titleKey)}</h1>
        <div className="h-1 w-16 bg-black mb-12"></div>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          <p>{t(introKey)}</p>

          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-black uppercase tracking-tight">{t(section.titleKey)}</h2>
              {section.introKey && <p>{t(section.introKey)}</p>}
              {section.textKey && <p>{t(section.textKey)}</p>}
              {section.items && section.items.length > 0 && (
                <ul className="list-disc pl-6 space-y-2">
                  {section.items.map((itemKey, i) => (
                    <li key={i}>{t(itemKey)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="bg-black/5 p-6 rounded mt-8">
            <p className="font-semibold text-black">{t("policy.contactSupport")}</p>
            <p>{t("policy.contactEmail")} | {t("policy.contactHotline")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
