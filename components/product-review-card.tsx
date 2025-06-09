import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProductReviewCardProps {
  name: string
  avatar: string
  rating: number
  date: string
  review: string
}

export default function ProductReviewCard({ name, avatar, rating, date, review }: ProductReviewCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Image src={avatar || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded-full mr-4" />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-gray-400 text-sm">{date}</p>
          </div>
        </div>
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? "fill-rose-500 text-rose-500" : "fill-gray-700 text-gray-700"}`}
            />
          ))}
        </div>
        <p className="text-gray-300">{review}</p>
      </CardContent>
    </Card>
  )
}
