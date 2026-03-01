"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"

interface CreateVoucherModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateVoucherModal({ isOpen, onClose, onSuccess }: CreateVoucherModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        code: "",
        discount_amount: "",
        status: "active"
    })

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("admin_token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/vouchers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    discount_amount: formData.discount_amount ? parseInt(formData.discount_amount) : 0
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Lỗi khi tạo voucher")
            }

            onSuccess()
            onClose()
            setFormData({ code: "", discount_amount: "", status: "active" })
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
                    <h2 className="text-xl font-semibold">Tạo Voucher Mới</h2>
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
                            Mã Voucher (Code) *
                        </label>
                        <input
                            type="text"
                            name="code"
                            required
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black uppercase"
                            placeholder="VD: KHUYENMAI2024"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mức giảm giá (VNĐ)
                        </label>
                        <input
                            type="number"
                            name="discount_amount"
                            value={formData.discount_amount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="0"
                            min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Để trống nếu cấu hình phần trăm giảm trên hệ thống Pancake POS</p>
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
                            <option value="active">Hoạt động</option>
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
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tạo Mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
