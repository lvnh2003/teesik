"use client"

import { useEffect, useState } from "react"
import { getTransactions } from "@/lib/admin-api"
import { Transaction } from "@/type"
import { format } from "date-fns"
import { Loader2, CreditCard } from "lucide-react"

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const response = await getTransactions({
                page: currentPage,
                limit: 10
            })
            setTransactions(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [currentPage])

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "success": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "failed": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Giao dịch</h1>
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
                                    <th className="px-6 py-3">Mã GD</th>
                                    <th className="px-6 py-3">Số tiền</th>
                                    <th className="px-6 py-3">Phương thức</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Ngày giao dịch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy giao dịch nào
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction) => (
                                        <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">#{transaction.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(transaction.amount || transaction.price || 0)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                                    {transaction.payment_method || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status || "Hoàn thành"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {transaction.created_at || transaction.inserted_at
                                                    ? format(new Date(transaction.created_at || transaction.inserted_at), "dd/MM/yyyy HH:mm")
                                                    : "N/A"}
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
