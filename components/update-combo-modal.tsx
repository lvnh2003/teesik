"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Combo } from "@/type"
import { updateCombo } from "@/lib/admin-api"

interface UpdateComboModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    combo: Combo | null
}

export default function UpdateComboModal({ isOpen, onClose, onSuccess, combo }: UpdateComboModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        status: "active"
    })

    useEffect(() => {
        if (combo && isOpen) {
            setFormData({
                name: combo.name || "",
                price: combo.price ? combo.price.toString() : "",
                status: combo.status || "active"
            })
        }
    }, [combo, isOpen])

    if (!isOpen || !combo) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await updateCombo(combo.id, {
                ...combo,
                ...formData,
                price: formData.price ? parseInt(formData.price) : (combo.price || 0)
            })

            onSuccess()
            onClose()
            setFormData({ name: "", price: "", status: "active" })
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
                    <h2 className="text-xl font-semibold">Chỉnh sửa Combo</h2>
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
                            Tên Combo *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="VD: Combo Mùa Hè"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá trị Combo (VNĐ)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="0"
                            min="0"
                        />
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
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
