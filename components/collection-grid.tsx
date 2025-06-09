import Link from "next/link"
import Image from "next/image"

export default function CollectionGrid() {
  const collections = [
    {
      id: 1,
      name: "TOTE BAGS",
      image: "/images/collection-summer.jpg",
      slug: "tote-bags",
      description: "Túi xách tay thanh lịch",
    },
    {
      id: 2,
      name: "CROSSBODY",
      image: "/images/collection-business.jpg",
      slug: "crossbody",
      description: "Túi đeo chéo tiện dụng",
    },
    {
      id: 3,
      name: "BACKPACKS",
      image: "/images/collection-travel.jpg",
      slug: "backpacks",
      description: "Balo thời trang hiện đại",
    },
    {
      id: 4,
      name: "CLUTCHES",
      image: "/images/collection-summer.jpg",
      slug: "clutches",
      description: "Túi clutch sang trọng",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <Link key={collection.id} href={`/collections/${collection.slug}`} className="group">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-lg md:text-xl tracking-wider mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                {collection.name}
              </h3>
              <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {collection.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
