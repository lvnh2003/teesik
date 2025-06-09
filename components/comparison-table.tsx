import { Check, X } from "lucide-react"

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 bg-gray-900 rounded-tl-lg">Tính năng</th>
            <th className="p-4 bg-rose-900/30 text-rose-500 font-bold">
              Phantom X9 Pro
              <div className="text-sm font-normal text-gray-300 mt-1">Sản phẩm của chúng tôi</div>
            </th>
            <th className="p-4 bg-gray-900">
              SoundMaster Pro
              <div className="text-sm font-normal text-gray-400 mt-1">Đối thủ A</div>
            </th>
            <th className="p-4 bg-gray-900 rounded-tr-lg">
              AudioElite 700
              <div className="text-sm font-normal text-gray-400 mt-1">Đối thủ B</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Thời lượng pin</td>
            <td className="p-4 bg-rose-900/10 text-center font-medium">40 giờ</td>
            <td className="p-4 bg-gray-900 text-center">30 giờ</td>
            <td className="p-4 bg-gray-900 text-center">25 giờ</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Chống ồn chủ động</td>
            <td className="p-4 bg-rose-900/10 text-center">
              <Check className="mx-auto text-rose-500" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Chất lượng âm thanh</td>
            <td className="p-4 bg-rose-900/10 text-center font-medium">Hi-Fi, 40mm Dynamic</td>
            <td className="p-4 bg-gray-900 text-center">35mm Dynamic</td>
            <td className="p-4 bg-gray-900 text-center">38mm Dynamic</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Bluetooth</td>
            <td className="p-4 bg-rose-900/10 text-center font-medium">5.3</td>
            <td className="p-4 bg-gray-900 text-center">5.0</td>
            <td className="p-4 bg-gray-900 text-center">5.2</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Kết nối đa điểm</td>
            <td className="p-4 bg-rose-900/10 text-center">
              <Check className="mx-auto text-rose-500" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <X className="mx-auto text-gray-600" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Chống nước</td>
            <td className="p-4 bg-rose-900/10 text-center font-medium">IPX4</td>
            <td className="p-4 bg-gray-900 text-center">IPX2</td>
            <td className="p-4 bg-gray-900 text-center">IPX3</td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Điều khiển cảm ứng</td>
            <td className="p-4 bg-rose-900/10 text-center">
              <Check className="mx-auto text-rose-500" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <X className="mx-auto text-gray-600" />
            </td>
          </tr>
          <tr className="border-b border-gray-800">
            <td className="p-4 bg-gray-900 font-medium">Ứng dụng điều khiển</td>
            <td className="p-4 bg-rose-900/10 text-center">
              <Check className="mx-auto text-rose-500" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
            <td className="p-4 bg-gray-900 text-center">
              <Check className="mx-auto text-gray-400" />
            </td>
          </tr>
          <tr>
            <td className="p-4 bg-gray-900 font-medium rounded-bl-lg">Giá</td>
            <td className="p-4 bg-rose-900/10 text-center font-bold">4.990.000đ</td>
            <td className="p-4 bg-gray-900 text-center">5.490.000đ</td>
            <td className="p-4 bg-gray-900 text-center rounded-br-lg">4.790.000đ</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
