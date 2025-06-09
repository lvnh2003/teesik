import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Collection {
  id: number
  name: string
  description: string
  image: string
  link: string
}

interface FeaturedCollectionProps {
  collections: Collection[]
}

export default function FeaturedCollection({ collections }: FeaturedCollectionProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {collections.map((collection) => (
        <div key={collection.id} className="group relative overflow-hidden rounded-lg">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white text-xl font-bold mb-2">{collection.name}</h3>
            <p className="text-gray-200 mb-4">{collection.description}</p>
            <Button asChild className="bg-white text-gray-900 hover:bg-gray-100">
              <Link href={collection.link}>
                Khám phá
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
