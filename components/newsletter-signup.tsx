import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h3 className="text-2xl font-bold mb-4">Đăng ký nhận thông tin</h3>
      <p className="text-gray-600 mb-6">
        Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và các mẹo kinh doanh dropshipping.
      </p>
      <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <Input type="email" placeholder="Email của bạn" className="flex-1" required />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Đăng ký
        </Button>
      </form>
    </div>
  )
}
