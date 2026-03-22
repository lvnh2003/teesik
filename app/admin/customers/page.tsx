"use client"

import { useEffect, useState } from "react"
import { PosService } from "@/services/pos"
import { Customer } from "@/type"
import { format } from "date-fns"
import { Loader2, Search, UserPlus } from "lucide-react"

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState("")

    const fetchCustomers = async () => {
        setLoading(true)
        try {
            const response = await PosService.getCustomers({
                page: currentPage,
                limit: 10,
                search: search
            })
            setCustomers(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch customers", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [currentPage])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchCustomers()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                    <UserPlus className="h-4 w-4" />
                    Thêm khách hàng
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, SDT..."
                                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                            Tìm
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Mã KH</th>
                                    <th className="px-6 py-3">Tên Khách Hàng</th>
                                    <th className="px-6 py-3">Số Điện Thoại</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy khách hàng nào
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">#{customer.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {customer.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.phone_number || customer.phone || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.email || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.created_at || customer.inserted_at
                                                    ? format(new Date(customer.created_at || customer.inserted_at), "dd/MM/yyyy")
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
