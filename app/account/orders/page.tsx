"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { OrderService } from "@/services/orders"
import { Order } from "@/type"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Search,
  ShoppingBag,
  ArrowUpDown,
  FileText,
  BarChart2,
  Table as TableIcon
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { exportOrdersToCSV, exportOrdersToPDF } from "@/utils/exportUtils"
import { OrderChart } from "@/components/OrderHistory/OrderChart"
import { useDebouncedCallback } from "use-debounce"

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Đang giao", value: "shipped" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
  { label: "Trả hàng", value: "returned" },
]

const ITEMS_PER_PAGE = 10

export default function OrderHistoryPage() {
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortBy, setSortBy] = useState<"created_at" | "total_amount" | "status">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/account")
    }
  }, [isLoggedIn, authLoading, router])

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await OrderService.getUserOrders({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      })
      
      let fetchedOrders = response.data || []
      
      // Since backend doesn't explicitly support dateTo and dateFrom perfectly, we fallback to local filter.
      if (dateFrom) {
        fetchedOrders = fetchedOrders.filter((o) => new Date(o.created_at) >= new Date(dateFrom))
      }
      if (dateTo) {
        fetchedOrders = fetchedOrders.filter((o) => new Date(o.created_at) <= new Date(dateTo + "T23:59:59"))
      }

      fetchedOrders.sort((a, b) => {
        let comparison = 0
        if (sortBy === "created_at") {
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        } else if (sortBy === "total_amount") {
          comparison = a.total_amount - b.total_amount
        } else if (sortBy === "status") {
          comparison = a.status.localeCompare(b.status)
        }
        return sortOrder === "asc" ? comparison : -comparison
      })

      setOrders(fetchedOrders)
      if (response.meta) {
        setMeta(response.meta)
      } else {
        setMeta({
            current_page: 1, last_page: Math.max(1, Math.ceil(fetchedOrders.length / ITEMS_PER_PAGE)), total: fetchedOrders.length
        })
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setOrders([])
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const debouncedFetch = useDebouncedCallback(() => {
    fetchOrders()
  }, 500)

  // Fetch orders
  useEffect(() => {
    if (isLoggedIn) {
      debouncedFetch()
    }
  }, [isLoggedIn, currentPage, statusFilter, dateFrom, dateTo, sortBy, sortOrder, searchQuery])

  // Polling every 30 seconds
  useEffect(() => {
    if (!isLoggedIn) return
    const interval = setInterval(() => {
      fetchOrders(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [isLoggedIn, currentPage, statusFilter, dateFrom, dateTo, sortBy, sortOrder, searchQuery])


  // Pagination Mapping since we fetched exactly current page
  const totalPages = meta?.last_page || 1
  const paginatedOrders = orders

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    // Note: sorting triggers refetch in effect hooks
  }

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      processing: "secondary",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
      returned: "destructive",
    }
    return variants[status] || "outline"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (authLoading || !isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 border-b border-gray-200 bg-white">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">
            TÀI KHOẢN
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-xl text-gray-600">Xem và quản lý tất cả đơn hàng của bạn</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-black tracking-tighter uppercase">
                Đơn hàng ({meta?.total || orders.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")} variant="outline" className="gap-2 hidden md:flex">
                  {viewMode === "table" ? <BarChart2 className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
                  {viewMode === "table" ? "Biểu đồ" : "Bảng"}
                </Button>
                <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2" disabled={orders.length === 0}>
                      <Download className="h-4 w-4" />
                      Xuất file
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportOrdersToCSV(orders)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" /> Xuất CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportOrdersToPDF(orders)} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" /> Xuất PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm theo mã đơn, tên, email hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Trạng thái</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Từ ngày</label>
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đến ngày</label>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter("")
                      setDateFrom("")
                      setDateTo("")
                      setSearchQuery("")
                      setCurrentPage(1)
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            )}

            {/* Orders Table or Chart */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                <Button onClick={() => router.push("/products")} className="bg-black hover:bg-gray-800">
                  Mua sắm ngay
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "chart" ? (
                  <div className="mb-6">
                    <OrderChart orders={orders} />
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">
                              <Button
                                variant="ghost"
                                className="font-semibold hover:bg-transparent"
                                onClick={() => handleSort("created_at")}
                              >
                                Mã đơn
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </th>
                            <th className="text-left p-4">Ngày đặt</th>
                            <th className="text-left p-4">Khách hàng</th>
                            <th className="text-right p-4">
                              <Button
                                variant="ghost"
                                className="font-semibold hover:bg-transparent"
                                onClick={() => handleSort("total_amount")}
                              >
                                Tổng tiền
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </th>
                            <th className="text-left p-4">
                              <Button
                                variant="ghost"
                                className="font-semibold hover:bg-transparent"
                                onClick={() => handleSort("status")}
                              >
                                Trạng thái
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </th>
                            <th className="text-right p-4">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                <span className="font-medium">#{order.id}</span>
                              </td>
                              <td className="p-4">
                                {format(new Date(order.created_at), "dd/MM/yyyy", { locale: vi })}
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{order.customer_name}</p>
                                  <p className="text-sm text-gray-500">{order.customer_email}</p>
                                </div>
                              </td>
                              <td className="p-4 text-right font-medium">
                                {formatCurrency(order.total_amount)}
                              </td>
                              <td className="p-4">
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedOrder(order)}
                                  className="gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden space-y-4">
                      {paginatedOrders.map((order) => (
                        <Card key={order.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold">#{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(order.created_at), "dd/MM/yyyy", { locale: vi })}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-3">
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-gray-600">{order.customer_email}</p>
                            <p className="text-lg font-bold">{formatCurrency(order.total_amount)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="w-full gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Xem chi tiết
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-black hover:bg-gray-800 text-white" : ""}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black tracking-tighter uppercase">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="font-medium">
                        {format(new Date(selectedOrder.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thanh toán:</span>
                      <span className="font-medium">{selectedOrder.payment_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium">{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SĐT:</span>
                      <span className="font-medium">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-right max-w-[200px]">
                        {selectedOrder.shipping_address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold mb-3">Sản phẩm ({selectedOrder.items?.length || 0})</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Sản phẩm</th>
                          <th className="text-center p-3 text-sm font-medium">SL</th>
                          <th className="text-right p-3 text-sm font-medium">Đơn giá</th>
                          <th className="text-right p-3 text-sm font-medium">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                {item.variation_info && (
                                  <p className="text-sm text-gray-500">{item.variation_info}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                            <td className="p-3 text-right font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-bold">
                        <tr>
                          <td colSpan={3} className="p-3 text-right">
                            Tổng cộng:
                          </td>
                          <td className="p-3 text-right">{formatCurrency(selectedOrder.total_amount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">Không có sản phẩm nào</p>
                )}
              </div>

              {/* Notes */}
              {selectedOrder.note && (
                <div>
                  <h4 className="font-bold mb-2">Ghi chú</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedOrder.note}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Đóng
                </Button>
                {selectedOrder.payment_status === "unpaid" && selectedOrder.payment_method !== "cod" && (
                  <Button className="bg-black hover:bg-gray-800 text-white">Thanh toán ngay</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}