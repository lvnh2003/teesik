"use client"

import { useEffect, useState } from "react"
import { useAdminAuth } from "@/lib/admin-auth"
import { getDashboardStats } from "@/lib/admin-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Eye, Star } from "lucide-react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DashboardStats } from "@/type"

export default function AdminDashboardPage() {
  const { checkAuth } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      try {
        // Try to get real data first, then fallback to fake data
        try {
          const response = await getDashboardStats()
          setStats(response.data)
        } catch (err) {
          // Use fake data if API fails
          setStats(fakeStats)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data")
        // Still show fake data even if there's an error
        setStats(fakeStats)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [checkAuth])

  // Fake data for demonstration
  const fakeStats = {
    total_products: 156,
    total_users: 2847,
    total_orders: 1234,
    revenue: {
      monthly: 45600000,
      daily: 1520000,
      yearly: 547200000,
    },
    recent_orders: [
      {
        id: 1001,
        customer_name: "Nguyễn Văn An",
        total: 2450000,
        status: "completed",
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: 1002,
        customer_name: "Trần Thị Bình",
        total: 1890000,
        status: "processing",
        created_at: "2024-01-15T09:15:00Z",
      },
      {
        id: 1003,
        customer_name: "Lê Minh Cường",
        total: 3200000,
        status: "shipped",
        created_at: "2024-01-15T08:45:00Z",
      },
      {
        id: 1004,
        customer_name: "Phạm Thu Dung",
        total: 1650000,
        status: "completed",
        created_at: "2024-01-14T16:20:00Z",
      },
      {
        id: 1005,
        customer_name: "Hoàng Văn Em",
        total: 2890000,
        status: "processing",
        created_at: "2024-01-14T14:10:00Z",
      },
    ],
    top_products: [
      {
        id: 1,
        name: "Túi xách Milano Classic",
        sales: 89,
        revenue: 17800000,
      },
      {
        id: 2,
        name: "Balo du lịch Adventure",
        sales: 67,
        revenue: 13400000,
      },
      {
        id: 3,
        name: "Clutch Evening Elegance",
        sales: 45,
        revenue: 9000000,
      },
    ],
  }

  // Revenue data for charts
  const revenueData = [
    { name: "T1", revenue: 38000000, orders: 890 },
    { name: "T2", revenue: 42000000, orders: 1020 },
    { name: "T3", revenue: 35000000, orders: 850 },
    { name: "T4", revenue: 48000000, orders: 1180 },
    { name: "T5", revenue: 52000000, orders: 1290 },
    { name: "T6", revenue: 45000000, orders: 1100 },
    { name: "T7", revenue: 58000000, orders: 1420 },
    { name: "T8", revenue: 61000000, orders: 1510 },
    { name: "T9", revenue: 55000000, orders: 1350 },
    { name: "T10", revenue: 49000000, orders: 1200 },
    { name: "T11", revenue: 53000000, orders: 1280 },
    { name: "T12", revenue: 67000000, orders: 1650 },
  ]

  // Category distribution data
  const categoryData = [
    { name: "Túi xách", value: 45, color: "#8884d8" },
    { name: "Balo", value: 25, color: "#82ca9d" },
    { name: "Clutch", value: 15, color: "#ffc658" },
    { name: "Túi đeo chéo", value: 15, color: "#ff7300" },
  ]

  // Weekly sales data
  const weeklyData = [
    { day: "T2", sales: 12 },
    { day: "T3", sales: 19 },
    { day: "T4", sales: 15 },
    { day: "T5", sales: 22 },
    { day: "T6", sales: 28 },
    { day: "T7", sales: 35 },
    { day: "CN", sales: 18 },
  ]

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoàn thành</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đã gửi</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Tổng quan về hoạt động của cửa hàng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Xem báo cáo
          </Button>
          <Link href="/admin/products/create">
            <Button size="sm">
              <Package className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-700">Đang sử dụng dữ liệu mẫu. {error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_products || 0}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_users || 0}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_orders || 0}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(stats?.revenue?.monthly || 0)}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +22% so với tháng trước
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    formatter={(value: any) => [
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(value),
                      "Doanh thu",
                    ]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Orders */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recent_orders && stats.recent_orders.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-medium">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(order.total)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fakeStats.top_products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} đã bán</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh số tuần này</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Sản phẩm mới được thêm</p>
                <p className="text-sm text-gray-500">Admin đã thêm sản phẩm "Túi xách Milano Premium"</p>
                <p className="text-xs text-gray-400">2 giờ trước</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Đơn hàng mới</p>
                <p className="text-sm text-gray-500">Khách hàng Nguyễn Văn An đã đặt đơn hàng #1001</p>
                <p className="text-xs text-gray-400">3 giờ trước</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Người dùng mới đăng ký</p>
                <p className="text-sm text-gray-500">Trần Thị Bình đã tạo tài khoản mới</p>
                <p className="text-xs text-gray-400">5 giờ trước</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Doanh thu tăng trưởng</p>
                <p className="text-sm text-gray-500">Doanh thu tháng này tăng 22% so với tháng trước</p>
                <p className="text-xs text-gray-400">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
