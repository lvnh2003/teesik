"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Calendar, ShoppingBag, Heart, Settings } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/account")
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 border-b border-gray-200 bg-white">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">DASHBOARD</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">
            Chào mừng trở lại
          </h1>
          <p className="text-xl text-gray-600">Quản lý tài khoản và đơn hàng của bạn</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 shadow-lg">
              <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Thông Tin Cá Nhân</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">Họ và tên</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{user.phone}</p>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString("vi-VN")}</p>
                    <p className="text-sm text-gray-600">Ngày tham gia</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white"
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Orders */}
              <div className="bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black tracking-tighter uppercase">Đơn Hàng</h3>
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm text-gray-600">Tổng số đơn hàng</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-black text-black hover:bg-black hover:text-white"
                >
                  Xem đơn hàng
                </Button>
              </div>

              {/* Wishlist */}
              <div className="bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black tracking-tighter uppercase">Yêu Thích</h3>
                  <Heart className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm text-gray-600">Sản phẩm yêu thích</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-black text-black hover:bg-black hover:text-white"
                >
                  Xem danh sách
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 shadow-lg">
              <h3 className="text-lg font-black tracking-tighter uppercase mb-6">Hoạt Động Gần Đây</h3>
              <div className="text-center py-12">
                <p className="text-gray-600">Chưa có hoạt động nào</p>
                <p className="text-sm text-gray-500 mt-2">Bắt đầu mua sắm để xem lịch sử hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
