"use client"

import { useEffect, useState } from "react"
import { PosService } from "@/services/pos"
import { Promotion } from "@/type"
import { format } from "date-fns"
import { Loader2, Tag } from "lucide-react"

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)


    const fetchPromotions = async () => {
        setLoading(true)
        try {
            const response = await PosService.getPromotions({
                page: currentPage,
                limit: 10
            })
            setPromotions(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch promotions", error)
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        fetchPromotions()
    }, [currentPage])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Khuyến mãi</h1>
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
                                    <th className="px-6 py-3">Mã Khuyến mãi</th>
                                    <th className="px-6 py-3">Tên Khuyến mãi</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Từ ngày</th>
                                    <th className="px-6 py-3">Đến ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy chương trình khuyến mãi nào
                                        </td>
                                    </tr>
                                ) : (
                                    promotions.map((promotion) => (
                                        <tr key={promotion.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-gray-400" />
                                                #{promotion.id}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {promotion.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(!promotion.status || promotion.status === 'active') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {promotion.status === 'active' || !promotion.status ? "Đang chạy" : "Tạm dừng"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {promotion.start_date
                                                    ? format(new Date(promotion.start_date), "dd/MM/yyyy HH:mm")
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {promotion.end_date
                                                    ? format(new Date(promotion.end_date), "dd/MM/yyyy HH:mm")
                                                    : "Không giới hạn"}
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

        </div>
    )
}
