import Image from "next/image"
import Link from "next/link"
import { Instagram, Heart } from "lucide-react"

export default function InstagramFeed() {
  const instagramPosts = [
    {
      id: 1,
      image: "/images/tote-bag-1.jpg",
      link: "https://instagram.com",
      likes: 1234,
    },
    {
      id: 2,
      image: "/images/crossbody-bag-1.jpg",
      link: "https://instagram.com",
      likes: 987,
    },
    {
      id: 3,
      image: "/images/backpack-1.jpg",
      link: "https://instagram.com",
      likes: 2156,
    },
    {
      id: 4,
      image: "/images/clutch-bag-1.jpg",
      link: "https://instagram.com",
      likes: 876,
    },
    {
      id: 5,
      image: "/images/shoulder-bag-1.jpg",
      link: "https://instagram.com",
      likes: 1543,
    },
    {
      id: 6,
      image: "/images/messenger-bag-1.jpg",
      link: "https://instagram.com",
      likes: 1098,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {instagramPosts.map((post) => (
        <Link key={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className="group">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Instagram post"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Instagram className="text-white h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex items-center text-white text-sm">
                <Heart className="h-4 w-4 mr-1 fill-current" />
                <span>{post.likes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
