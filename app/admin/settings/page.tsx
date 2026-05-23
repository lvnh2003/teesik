"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Building2, Globe, Mail, Phone, Loader2, Save, Database, RefreshCw, AlertCircle } from "lucide-react"
import { SyncRun, SyncService, SyncState } from "@/services/sync"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const [syncStates, setSyncStates] = useState<SyncState[]>([])
    const [syncRuns, setSyncRuns] = useState<SyncRun[]>([])
    const [syncError, setSyncError] = useState("")
    const [formData, setFormData] = useState({
        storeName: "TEESIK",
        phone: "1900 1234",
        email: "support@teesik.vn",
        address: "123 Quận 1, TP. Hồ Chí Minh",
        website: "https://teesik.vn",
        maintenanceMode: false
    })

    const loadSyncStatus = async () => {
        try {
            const response = await SyncService.getStatus()
            setSyncStates(response.data.states)
            setSyncRuns(response.data.runs)
            setSyncError("")
        } catch (error: any) {
            setSyncError(error?.message || "Không thể tải trạng thái đồng bộ.")
        }
    }

    useEffect(() => {
        loadSyncStatus()
    }, [])

    const handleSync = async (entity?: "categories" | "products" | "vouchers" | "orders") => {
        setSyncLoading(true)
        setSyncError("")
        try {
            await SyncService.trigger(entity)
            await loadSyncStatus()
        } catch (error: any) {
            setSyncError(error?.message || "Đồng bộ thất bại.")
            await loadSyncStatus()
        } finally {
            setSyncLoading(false)
        }
    }

    const formatDate = (value?: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Chưa đồng bộ"

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        // Giả lập lưu API
        setTimeout(() => {
            setLoading(false)
            alert("Đã lưu cấu hình cài đặt thành công!")
        }, 800)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Thông tin cửa hàng */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-gray-500" />
                        Thông tin cửa hàng
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tên cửa hàng</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Trang Web</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email liên hệ</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Trạng thái hệ thống */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-gray-500" />
                        Trạng thái hệ thống
                    </h2>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div>
                            <h3 className="font-medium text-gray-900">Chế độ bảo trì</h3>
                            <p className="text-sm text-gray-500">Tạm thời đóng cửa Web Store với khách hàng để cập nhật. Admin vẫn truy cập bình thường.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.maintenanceMode}
                                onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Database className="h-5 w-5 text-gray-500" />
                            Đồng bộ dữ liệu Pancake
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" disabled={syncLoading} onClick={() => handleSync()} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md disabled:opacity-70">
                                {syncLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Đồng bộ tất cả
                            </button>
                            <button type="button" disabled={syncLoading} onClick={() => handleSync("products")} className="px-4 py-2 border rounded-md disabled:opacity-70">Sản phẩm</button>
                            <button type="button" disabled={syncLoading} onClick={() => handleSync("categories")} className="px-4 py-2 border rounded-md disabled:opacity-70">Danh mục</button>
                            <button type="button" disabled={syncLoading} onClick={() => handleSync("vouchers")} className="px-4 py-2 border rounded-md disabled:opacity-70">Voucher</button>
                            <button type="button" disabled={syncLoading} onClick={() => handleSync("orders")} className="px-4 py-2 border rounded-md disabled:opacity-70">Đơn hàng</button>
                        </div>
                    </div>

                    {syncError && (
                        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            {syncError}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-gray-500">
                                    <th className="py-2 pr-4">Loại dữ liệu</th>
                                    <th className="py-2 pr-4">Trạng thái</th>
                                    <th className="py-2 pr-4">Lần đồng bộ cuối</th>
                                    <th className="py-2 pr-4">Số bản ghi</th>
                                    <th className="py-2 pr-4">Độ mới</th>
                                    <th className="py-2">Lỗi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {syncStates.length === 0 ? (
                                    <tr><td className="py-4 text-gray-500" colSpan={6}>Chưa có dữ liệu đồng bộ.</td></tr>
                                ) : syncStates.map(state => (
                                    <tr key={state.entity} className="border-b">
                                        <td className="py-3 pr-4 font-medium">{state.entity}</td>
                                        <td className="py-3 pr-4">{state.status}</td>
                                        <td className="py-3 pr-4">{formatDate(state.last_synced_at)}</td>
                                        <td className="py-3 pr-4">{state.last_records_synced}</td>
                                        <td className="py-3 pr-4">{state.freshness}</td>
                                        <td className="py-3 text-red-600">{state.last_error || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {syncRuns.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium mb-3">Log gần đây</h3>
                            <div className="space-y-2">
                                {syncRuns.slice(0, 5).map(run => (
                                    <div key={run.id} className="rounded-md border bg-gray-50 p-3 text-sm">
                                        <div className="flex flex-wrap justify-between gap-2">
                                            <span className="font-medium">{run.entity} - {run.status}</span>
                                            <span className="text-gray-500">{formatDate(run.started_at)}</span>
                                        </div>
                                        <div className="mt-1 text-gray-600">Fetched {run.fetched_count}, upserted {run.upserted_count}</div>
                                        {run.error && <div className="mt-1 text-red-600">{run.error}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hành động */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    )
}
