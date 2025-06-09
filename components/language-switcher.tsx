"use client"

import { Check, ChevronDown, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import HydrationWrapper from "@/components/hydration-wrapper"

export default function LanguageSwitcher() {
  const { language, setLanguage, isLoaded } = useLanguage()

  const languages = [
    { code: "vi" as const, name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en" as const, name: "English", flag: "🇺🇸" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  // Static fallback for SSR
  const StaticFallback = () => (
    <div className="flex items-center text-sm text-gray-700">
      <Globe className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Tiếng Việt</span>
      <span className="sm:hidden">🇻🇳</span>
      <ChevronDown className="h-4 w-4 ml-1" />
    </div>
  )

  return (
    <HydrationWrapper fallback={<StaticFallback />}>
      {isLoaded && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-sm focus:outline-none text-gray-700 hover:text-gray-900 transition-colors">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{currentLanguage?.name}</span>
            <span className="sm:hidden">{currentLanguage?.flag}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </div>
                {language === lang.code && <Check className="h-4 w-4 ml-2 text-gray-900" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </HydrationWrapper>
  )
}
