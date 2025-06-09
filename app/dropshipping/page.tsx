import Image from "next/image"
import { ArrowRight, Check, Globe, Package, DollarSign, BarChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DropshippingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">DROPSHIPPING PROGRAM</h1>
              <p className="text-xl text-gray-300 mb-8">
                Bắt đầu kinh doanh túi xách thời trang mà không cần tồn kho. Chúng tôi xử lý mọi thứ từ sản xuất, đóng
                gói đến vận chuyển trực tiếp đến khách hàng của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  ĐĂNG KÝ NGAY
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  TÌM HIỂU THÊM
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Dropshipping Program"
                width={600}
                height={600}
                className="rounded-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-black p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-black rounded-full p-2">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Lợi nhuận cao</p>
                    <p className="text-sm text-gray-500">Biên lợi nhuận lên đến 300%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">LỢI ÍCH CỦA CHƯƠNG TRÌNH DROPSHIPPING</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="bg-neutral-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Không cần tồn kho</h3>
                <p className="text-gray-600">
                  Bạn không cần phải mua hàng trước hoặc lo lắng về việc lưu trữ hàng hóa. Chúng tôi xử lý tất cả.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-neutral-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Vận chuyển toàn cầu</h3>
                <p className="text-gray-600">
                  Chúng tôi giao hàng đến hơn 100 quốc gia với thời gian vận chuyển nhanh và theo dõi đơn hàng.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-neutral-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lợi nhuận cao</h3>
                <p className="text-gray-600">
                  Với giá sỉ cạnh tranh, bạn có thể đạt được biên lợi nhuận từ 100% đến 300% cho mỗi sản phẩm.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-100">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">QUY TRÌNH HOẠT ĐỘNG</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-black text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Đăng ký</h3>
              <p className="text-gray-600">Tạo tài khoản đối tác và duyệt danh mục sản phẩm</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Bán hàng</h3>
              <p className="text-gray-600">Đăng sản phẩm lên website hoặc marketplace của bạn</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Đặt hàng</h3>
              <p className="text-gray-600">Chuyển đơn hàng cho chúng tôi qua hệ thống hoặc API</p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Giao hàng</h3>
              <p className="text-gray-600">Chúng tôi xử lý và giao hàng trực tiếp đến khách hàng của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Plans */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">GÓI DỊCH VỤ DROPSHIPPING</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Gói Cơ bản</h3>
                <p className="text-gray-600 mb-4">Dành cho người mới bắt đầu</p>
                <div className="text-3xl font-bold mb-6">Miễn phí</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Truy cập danh mục sản phẩm</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Chiết khấu 10% giá bán lẻ</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Vận chuyển tiêu chuẩn</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Hỗ trợ email</span>
                  </li>
                </ul>
                <Button className="w-full bg-black hover:bg-neutral-800 text-white">ĐĂNG KÝ NGAY</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-black relative">
              <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-sm font-medium">
                Phổ biến nhất
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Gói Nâng cao</h3>
                <p className="text-gray-600 mb-4">Dành cho người bán chuyên nghiệp</p>
                <div className="text-3xl font-bold mb-6">1.199.000đ/tháng</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tất cả tính năng của gói Cơ bản</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Chiết khấu 25% giá bán lẻ</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Vận chuyển nhanh</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Hỗ trợ ưu tiên 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tích hợp API</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Nhãn hiệu riêng (White label)</span>
                  </li>
                </ul>
                <Button className="w-full bg-black hover:bg-neutral-800 text-white">ĐĂNG KÝ NGAY</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Gói Doanh nghiệp</h3>
                <p className="text-gray-600 mb-4">Dành cho doanh nghiệp lớn</p>
                <div className="text-3xl font-bold mb-6">4.999.000đ/tháng</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tất cả tính năng của gói Nâng cao</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Chiết khấu 40% giá bán lẻ</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Vận chuyển ưu tiên</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Quản lý tài khoản chuyên biệt</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tùy chỉnh sản phẩm</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Báo cáo phân tích nâng cao</span>
                  </li>
                </ul>
                <Button className="w-full bg-black hover:bg-neutral-800 text-white">ĐĂNG KÝ NGAY</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">CÂU HỎI THƯỜNG GẶP</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">Dropshipping là gì?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Dropshipping là mô hình kinh doanh trong đó bạn bán sản phẩm mà không cần tồn kho. Khi có đơn hàng,
                  bạn chuyển thông tin đến nhà cung cấp (chúng tôi), và chúng tôi sẽ đóng gói, giao hàng trực tiếp đến
                  khách hàng của bạn.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Tôi cần những gì để bắt đầu?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Bạn chỉ cần một nền tảng bán hàng (website, cửa hàng trên marketplace như Etsy, eBay, Amazon, hoặc
                  mạng xã hội) và đăng ký tài khoản đối tác với chúng tôi. Không cần vốn đầu tư lớn hoặc kinh nghiệm
                  trước đó.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Thời gian giao hàng là bao lâu?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Thời gian giao hàng phụ thuộc vào quốc gia đích và phương thức vận chuyển. Vận chuyển tiêu chuẩn mất
                  7-15 ngày làm việc, vận chuyển nhanh mất 3-7 ngày làm việc, và vận chuyển ưu tiên mất 1-3 ngày làm
                  việc.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Các quốc gia nào được hỗ trợ giao hàng?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Chúng tôi giao hàng đến hơn 100 quốc gia trên toàn thế giới, bao gồm Mỹ, Canada, Anh, EU, Úc, New
                  Zealand, và hầu hết các quốc gia ở Châu Á.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Phương thức thanh toán nào được chấp nhận?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Chúng tôi chấp nhận thanh toán qua PayPal, thẻ tín dụng/ghi nợ (Visa, Mastercard, American Express),
                  chuyển khoản ngân hàng, và các ví điện tử phổ biến.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">SẴN SÀNG BẮT ĐẦU KINH DOANH TÚI XÁCH TOÀN CẦU?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Đăng ký ngay hôm nay để trở thành đối tác dropshipping và bắt đầu kinh doanh mà không cần tồn kho.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-200">
            ĐĂNG KÝ LÀM ĐỐI TÁC
            <Users className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
