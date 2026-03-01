"use client"

import { useEffect, useState } from "react"
import { getVouchers } from "@/lib/admin-api"
import { Voucher } from "@/type"
import { Loader2, Plus, Ticket } from "lucide-react"
import CreateVoucherModal from "@/components/create-voucher-modal"

export default function AdminVouchersPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchVouchers = async () => {
        setLoading(true)
        try {
            const response = await getVouchers({
                page: currentPage,
                limit: 10
            })
            setVouchers(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch vouchers", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [currentPage])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tạo Voucher
                </button>
            </div>

            <div className="bg-blue-50 text-blue-800 rounded-md p-3 text-sm flex gap-2 items-start mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <p>
                    <strong>Lưu ý:</strong> API của Pancake POS hiện không cho phép bên thứ 3 (như website này) chỉnh sửa hoặc xóa mã khuyễn mãi dạng Voucher. Hãy quản lý chỉnh sửa Voucher trực tiếp trên hệ thống POS.
                </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Mã Voucher (Code)</th>
                                    <th className="px-6 py-3">Mức giảm giá</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy mã voucher nào
                                        </td>
                                    </tr>
                                ) : (
                                    vouchers.map((voucher) => (
                                        <tr key={voucher.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <Ticket className="h-4 w-4 text-gray-400" />
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{voucher.code || "UNKNOWN"}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {voucher.discount_amount
                                                    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(voucher.discount_amount)
                                                    : "Theo phần trăm hoặc cấu hình riêng"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(!voucher.status || voucher.status === 'active') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {voucher.status === 'active' || !voucher.status ? "Hoạt động" : "Tạm dừng"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                        Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            <CreateVoucherModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(1)
                    fetchVouchers()
                }}
            />
        </div>
    )
}
