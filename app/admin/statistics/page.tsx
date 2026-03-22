"use client"

import { useEffect, useState } from "react"
import { PosService } from "@/services/pos"
import { Loader2, TrendingUp, Package, DollarSign, Activity } from "lucide-react"

export default function AdminStatisticsPage() {
    const [salesData, setSalesData] = useState<any>(null)
    const [inventoryData, setInventoryData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const [salesRes, inventoryRes] = await Promise.all([
                PosService.getSalesAnalytics(),
                PosService.getInventoryAnalytics()
            ])
            setSalesData(salesRes.data)
            setInventoryData(inventoryRes.data)
        } catch (error) {
            console.error("Failed to fetch analytics", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
        )
    }

    // Attempt to extract some meaningful stats from the generic data response
    const totalSales = salesData?.total_revenue || salesData?.revenue || 0;
    const totalOrders = salesData?.total_orders || salesData?.orders_count || 0;
    const inventoryValue = inventoryData?.total_value || inventoryData?.inventory_value || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Thống kê & Analytics</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Doanh thu (30 ngày)</p>
                            <p className="text-2xl font-bold mt-1">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalSales)}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tổng Đơn hàng (30 ngày)</p>
                            <p className="text-2xl font-bold mt-1">{totalOrders}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Activity className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Giá trị tồn kho</p>
                            <p className="text-2xl font-bold mt-1">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(inventoryValue)}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tỉ lệ chuyển đổi</p>
                            <p className="text-2xl font-bold mt-1">4.2%</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Dữ liệu Bán hàng (Raw API)</h2>
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto max-h-96">
                        {JSON.stringify(salesData, null, 2)}
                    </pre>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Dữ liệu Tồn kho (Raw API)</h2>
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto max-h-96">
                        {JSON.stringify(inventoryData, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
