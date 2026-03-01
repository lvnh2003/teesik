"use client"

import { useEffect, useState } from "react"
import { deleteCombo, getCombos } from "@/lib/admin-api"
import { Combo } from "@/type"
import { Loader2, Plus, PackageOpen, Edit, Trash2 } from "lucide-react"
import CreateComboModal from "@/components/create-combo-modal"
import UpdateComboModal from "@/components/update-combo-modal"

export default function AdminCombosPage() {
    const [combos, setCombos] = useState<Combo[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [comboToEdit, setComboToEdit] = useState<Combo | null>(null)

    const fetchCombos = async () => {
        setLoading(true)
        try {
            const response = await getCombos({
                page: currentPage,
                limit: 10
            })
            setCombos(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch combos", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string | number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa combo này? Hành động này không thể hoàn tác.")) return;
        try {
            await deleteCombo(id);
            alert("Xóa combo thành công!");
            fetchCombos();
        } catch (error: any) {
            console.error("Failed to delete combo", error);
            alert("Lỗi khi xóa combo: " + error.message);
        }
    };

    useEffect(() => {
        fetchCombos()
    }, [currentPage])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Combo</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tạo Combo
                </button>
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
                                    <th className="px-6 py-3">Mã Combo</th>
                                    <th className="px-6 py-3">Tên Combo</th>
                                    <th className="px-6 py-3">Giá trị</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combos.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy combo nào
                                        </td>
                                    </tr>
                                ) : (
                                    combos.map((combo) => (
                                        <tr key={combo.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <PackageOpen className="h-4 w-4 text-gray-400" />
                                                #{combo.id}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {combo.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(combo.price || 0)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(!combo.status || combo.status === 'active') ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {combo.status === 'active' || !combo.status ? "Hoạt động" : "Tạm dừng"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setComboToEdit(combo)}
                                                        className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(combo.id)}
                                                        className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
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

            <CreateComboModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(1)
                    fetchCombos()
                }}
            />
            <UpdateComboModal
                isOpen={!!comboToEdit}
                combo={comboToEdit}
                onClose={() => setComboToEdit(null)}
                onSuccess={() => {
                    fetchCombos()
                }}
            />
        </div>
    )
}
