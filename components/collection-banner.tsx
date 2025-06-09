import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CollectionBanner() {
  return (
    <section className="py-20 md:py-32 bg-black text-white">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none">
              Summer
              <br />
              <span className="text-gray-400">Collection</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover our latest summer collection featuring lightweight materials, vibrant colors, and designs perfect
              for your warm-weather adventures.
            </p>
            <Link href="/collections/summer">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image src="/images/collection-summer.jpg" alt="Summer Collection" fill className="object-cover" />
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-8 -left-8 bg-white text-black p-6 shadow-2xl">
              <div className="text-3xl font-black mb-2">50+</div>
              <div className="text-sm font-medium tracking-wider uppercase">New Designs</div>
            </div>

            <div className="absolute -top-8 -right-8 bg-white text-black p-6 shadow-2xl">
              <div className="text-3xl font-black mb-2">100%</div>
              <div className="text-sm font-medium tracking-wider uppercase">Premium Quality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
