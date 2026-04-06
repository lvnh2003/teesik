"use client"

import { useMemo } from "react"
import { Order } from "@/type"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js"
import { Line, Doughnut } from "react-chartjs-2"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface OrderChartProps {
  orders: Order[]
}

export const OrderChart = ({ orders }: OrderChartProps) => {
  const lineChartData = useMemo(() => {
    // Group orders by date
    const dateGroups = orders.reduce((acc, order) => {
      const dateStr = format(new Date(order.created_at), "dd/MM/yyyy")
      if (!acc[dateStr]) acc[dateStr] = 0
      acc[dateStr] += order.total_amount
      return acc
    }, {} as Record<string, number>)

    // Sort by date (requires converting back if we used proper sorting, but for simplicity assuming ascending)
    const sortedDates = Object.keys(dateGroups).reverse() // Since orders are usually newest first

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Chi tiêu theo ngày (VNĐ)",
          data: sortedDates.map((date) => dateGroups[date]),
          borderColor: "rgb(0, 0, 0)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    }
  }, [orders])

  const doughnutChartData = useMemo(() => {
    const statusGroups = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const bgColors: Record<string, string> = {
      pending: "rgba(156, 163, 175, 0.8)",    // gray
      processing: "rgba(59, 130, 246, 0.8)",  // blue
      shipped: "rgba(16, 185, 129, 0.8)",     // green
      delivered: "rgba(5, 150, 105, 0.8)",    // dark green
      cancelled: "rgba(239, 68, 68, 0.8)",    // red
      returned: "rgba(220, 38, 38, 0.8)",     // dark red
    }

    return {
      labels: Object.keys(statusGroups),
      datasets: [
        {
          data: Object.values(statusGroups),
          backgroundColor: Object.keys(statusGroups).map((s) => bgColors[s] || "rgba(0,0,0,0.8)"),
          borderWidth: 1,
        },
      ],
    }
  }, [orders])

  if (!orders || orders.length === 0) {
    return <div className="text-center p-8 text-gray-500">Chưa có dữ liệu đồ thị</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4 bg-white rounded-lg border">
      <div className="md:col-span-2">
        <h3 className="text-lg font-bold mb-4">Mức chi tiêu theo thời gian</h3>
        <div className="h-[300px]">
          <Line 
            data={lineChartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Trạng thái đơn hàng</h3>
        <div className="h-[300px]">
          <Doughnut 
            data={doughnutChartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' } }
            }} 
          />
        </div>
      </div>
    </div>
  )
}
