"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface BannerCardProps {
  banner: {
    title: string
    subtitle: string
    buttonText: string
    image: {
      desktop: { url: string; width: number; height: number }
      mobile: { url: string; width: number; height: number }
    }
  }
  href?: string
  effectActive?: boolean
  variant?: "rounded" | "default"
  className?: string
  onClick?: () => void
}

export default function BannerCardLuxe({
  banner,
  href,
  effectActive = true,
  variant = "rounded",
  className = "",
  onClick,
}: BannerCardProps) {
  const { t } = useLanguage()

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const content = (
    <div className="h-full group flex justify-center relative overflow-hidden">
      {/* Text Overlay */}
      <div className="absolute left-0 top-0 z-10 bg-transparent p-4 rounded-lg h-full w-full md:w-2/3 lg:w-1/2 text-white lg:group-hover:scale-110 transition-transform duration-300">
        <div className="flex flex-col justify-center items-start md:items-center lg:items-center h-full">
          <div className="flex flex-col justify-center items-start h-full w-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-black tracking-tighter mb-1 md:mb-6 uppercase">
              {banner.title}
            </h2>
            <p className="text-base lg:text-2xl mb-4">{banner.subtitle}</p>
            <Button
              onClick={handleClick}
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-3 font-medium tracking-wider uppercase"
            >
              {banner.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <Image
        src={banner.image.desktop.url || "/placeholder.svg"}
        width={banner.image.desktop.width}
        height={banner.image.desktop.height}
        alt={banner.title}
        quality={100}
        className={`bg-gray-300 object-cover w-full lg:group-hover:scale-110 transition-transform duration-300 ${
          variant === "rounded" ? "rounded-lg" : ""
        }`}
        priority={true}
      />

      {/* Shine effect removed */}
    </div>
  )

  if (href) {
    return (
      <div className={`mx-auto ${className}`}>
        <Link href={href} className="block">
          {content}
        </Link>
      </div>
    )
  }

  return <div className={`mx-auto ${className}`}>{content}</div>
}
