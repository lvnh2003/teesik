import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Heart, Share2, ShoppingBag, Truck, RotateCcw, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductSlider from "@/components/product-slider"

export default function ProductPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch product data based on the slug
  const product = {
    id: 1,
    name: "MILANO TOTE",
    price: 1290000,
    description:
      "Túi xách tote Milano được thiết kế với phong cách tối giản, hiện đại. Được làm từ chất liệu da cao cấp, bền bỉ và sang trọng. Túi có kích thước rộng rãi, phù hợp cho công việc và đi chơi.",
    images: [
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
    colors: ["Đen", "Nâu", "Xanh Navy"],
    sizes: ["S", "M", "L"],
    features: [
      "Chất liệu da cao cấp",
      "Kích thước: 40 x 30 x 12 cm",
      "Ngăn chứa laptop 15 inch",
      "Túi zip bên trong",
      "Dây đeo có thể điều chỉnh",
    ],
    sku: "MT-001",
    category: "Tote Bags",
    inStock: true,
  }

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container px-4 mx-auto py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-black">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link href="/products" className="text-gray-500 hover:text-black">
          Sản phẩm
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-neutral-100">
            <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-neutral-100">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-2xl font-medium mb-6">{formatPrice(product.price)}</p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Màu sắc</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="border border-gray-300 px-4 py-2 rounded hover:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Kích thước</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="border border-gray-300 w-10 h-10 rounded flex items-center justify-center hover:border-black focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Số lượng</h3>
              <div className="flex items-center border border-gray-300 rounded w-fit">
                <button className="px-3 py-2 hover:bg-gray-100">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">1</span>
                <button className="px-3 py-2 hover:bg-gray-100">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black hover:bg-neutral-800 flex-1">
                <ShoppingBag className="mr-2 h-5 w-5" />
                THÊM VÀO GIỎ
              </Button>
              <Button size="lg" variant="outline" className="border-black hover:bg-black hover:text-white">
                <Heart className="mr-2 h-5 w-5" />
                YÊU THÍCH
              </Button>
              <Button size="icon" variant="outline" className="border-black hover:bg-black hover:text-white">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="border-t border-b border-gray-200 py-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Miễn phí vận chuyển</h4>
                  <p className="text-gray-500 text-sm">Cho đơn hàng trên 1.000.000đ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Đổi trả miễn phí</h4>
                  <p className="text-gray-500 text-sm">Trong vòng 30 ngày</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Bảo hành 1 năm</h4>
                  <p className="text-gray-500 text-sm">Cho các lỗi từ nhà sản xuất</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-sm text-gray-500">Danh mục: {product.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Mô tả
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Đặc điểm
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Vận chuyển & Đổi trả
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-gray-600">{product.description}</p>
          </TabsContent>
          <TabsContent value="features" className="pt-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="shipping" className="pt-6">
            <div className="space-y-4 text-gray-600">
              <h3 className="font-medium text-black">Chính sách vận chuyển</h3>
              <p>
                Chúng tôi cung cấp dịch vụ vận chuyển toàn quốc và quốc tế. Đơn hàng sẽ được xử lý trong vòng 1-2 ngày
                làm việc.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ</li>
                <li>Phí vận chuyển nội thành: 30.000đ</li>
                <li>Phí vận chuyển các tỉnh: 40.000đ - 60.000đ</li>
                <li>Vận chuyển quốc tế: Tùy thuộc vào quốc gia đích</li>
              </ul>

              <h3 className="font-medium text-black mt-6">Chính sách đổi trả</h3>
              <p>
                Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng, với điều kiện sản phẩm còn
                nguyên vẹn, chưa qua sử dụng và còn đầy đủ tem mác, hộp đựng.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
        <ProductSlider />
      </div>
    </div>
  )
}
