"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Promotion } from "@/type"
import { updatePromotion } from "@/lib/admin-api"
import { format } from "date-fns"

interface UpdatePromotionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    promotion: Promotion | null
}

export default function UpdatePromotionModal({ isOpen, onClose, onSuccess, promotion }: UpdatePromotionModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        start_date: "",
        end_date: "",
        status: "active"
    })

    useEffect(() => {
        if (promotion && isOpen) {
            setFormData({
                name: promotion.name || "",
                start_date: promotion.start_date ? format(new Date(promotion.start_date), "yyyy-MM-dd'T'HH:mm") : "",
                end_date: promotion.end_date ? format(new Date(promotion.end_date), "yyyy-MM-dd'T'HH:mm") : "",
                status: promotion.status || "active"
            })
        }
    }, [promotion, isOpen])

    if (!isOpen || !promotion) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await updatePromotion(promotion.id, {
                ...promotion,
                ...formData
            })

            onSuccess()
            onClose()
            setFormData({ name: "", start_date: "", end_date: "", status: "active" })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Chỉnh sửa Khuyến Mãi</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khuyến mãi *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Nhập tên khuyến mãi..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày kết thúc
                            </label>
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="active">Đang chạy</option>
                            <option value="inactive">Tạm dừng</option>
                        </select>
                    </div>

                    <div className="pt-4 mt-6 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 min-w-[100px] justify-center"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
