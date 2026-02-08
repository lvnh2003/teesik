"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "vi" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

import { vi } from "@/locales/vi"
import { en } from "@/locales/en"

const translations = {
  vi,
  en,
}


export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
