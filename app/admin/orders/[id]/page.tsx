"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getOrder, updateOrder } from "@/lib/admin-api"
import { Order } from "@/type"
import { format } from "date-fns"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import React from 'react'
import { toast } from "sonner"

export default function AdminOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("")

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return
            try {
                const response = await getOrder(Number(params.id))
                setOrder(response.data)
                setStatus(response.data.status)
                setPaymentStatus(response.data.payment_status)
            } catch (error) {
                console.error("Failed to fetch order", error)
                toast.error("Không tìm thấy đơn hàng")
                router.push("/admin/orders")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [params.id, router])

    const handleSave = async () => {
        if (!order) return
        setSaving(true)
        try {
            await updateOrder(order.id, {
                status: status as any,
                payment_status: paymentStatus as any
            })
            toast.success("Cập nhật đơn hàng thành công")
            // Refresh data
            const response = await getOrder(order.id)
            setOrder(response.data)
        } catch (error) {
            console.error("Failed to update order", error)
            toast.error("Cập nhật thất bại")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!order) return null

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Chi tiết đơn hàng #{order.id}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={item.id || index} className="flex justify-between items-start py-2 border-b last:border-0 gap-4">
                                    {/* Image */}
                                    {item.image ? (
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={item.image}
                                                alt={item.product_name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                                            <span className="text-xs text-gray-400">No Img</span>
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="font-medium">{item.product_name}</div>
                                        {item.variation_info && (
                                            <div className="text-sm text-gray-500">{item.variation_info}</div>
                                        )}
                                        <div className="text-sm text-gray-500 mt-1">
                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)} x {item.quantity}
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phí vận chuyển</span>
                                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.shipping_fee || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">COD</span>
                                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.cod || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 font-bold text-lg border-t mt-2">
                                    <span>Tổng cộng</span>
                                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Tên khách hàng</label>
                                <div className="font-medium">{order.customer_name}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <div className="font-medium">{order.customer_email || "N/A"}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Số điện thoại</label>
                                <div className="font-medium">{order.customer_phone || "Không có"}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Ngày tạo (Pancake)</label>
                                <div className="font-medium">{order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy HH:mm") : "N/A"}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm text-gray-500">Địa chỉ giao hàng</label>
                                <div className="font-medium">{order.shipping_address}</div>
                            </div>
                            {order.note && (
                                <div className="sm:col-span-2 bg-yellow-50 p-3 rounded border border-yellow-100">
                                    <label className="text-sm text-yellow-800 font-semibold">Ghi chú</label>
                                    <div className="text-sm text-yellow-800">{order.note}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions / Status */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className="font-medium px-2 py-0.5 bg-gray-100 rounded">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shop ID:</span>
                                <span className="font-medium">{order.shop_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Đối tác vận chuyển:</span>
                                <span className="font-medium">{order.partner ? order.partner.name || "N/A" : "N/A"}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-gray-500 italic text-center">
                                * Cập nhật trạng thái vui lòng thực hiện trên Pancake POS
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
