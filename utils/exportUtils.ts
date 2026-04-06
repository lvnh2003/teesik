import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Order } from "@/type"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const exportOrdersToCSV = (orders: Order[]) => {
  const headers = ["Mã đơn", "Ngày", "Khách hàng", "Email", "SĐT", "Tổng tiền", "Trạng thái"]
  const rows = orders.map((order) => [
    order.id.toString(),
    format(new Date(order.created_at), "dd/MM/yyyy", { locale: vi }),
    order.customer_name,
    order.customer_email || "",
    order.customer_phone || "",
    order.total_amount.toString(),
    order.status,
  ])

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `don-hang-${new Date().toISOString().split("T")[0]}.csv`
  link.click()
}

export const exportOrdersToPDF = (orders: Order[]) => {
  const doc = new jsPDF()
  
  doc.setFontSize(16)
  doc.text("Lich su don hang", 14, 20) // Using un-accented for PDF to avoid font issues with default helvetica
  
  const headers = [["Ma don", "Ngay dat", "Khach hang", "SDT", "Tong tien", "Trang thai"]]
  const data = orders.map(order => [
    `#${order.id}`,
    format(new Date(order.created_at), "dd/MM/yyyy"),
    order.customer_name, // Note: Vietnamese characters might not render perfectly without a custom VFS font, but we map as best as we can.
    order.customer_phone || "",
    formatCurrency(order.total_amount),
    order.status
  ])
  
  autoTable(doc, {
    startY: 30,
    head: headers,
    body: data,
    styles: { font: 'helvetica' },
  })
  
  doc.save(`don-hang-${new Date().toISOString().split("T")[0]}.pdf`)
}
