import { Headphones, Battery, Wifi, Volume2, Shield } from "lucide-react"

export default function ProductFeatures() {
  const features = [
    {
      icon: <Headphones className="w-10 h-10 text-rose-500" />,
      title: "Âm thanh Hi-Fi",
      description:
        "Trải nghiệm âm thanh chất lượng cao với công nghệ Hi-Fi tiên tiến, mang đến âm bass sâu và treble trong trẻo.",
    },
    {
      icon: <Battery className="w-10 h-10 text-rose-500" />,
      title: "Pin 40 giờ",
      description: "Thời lượng pin lên đến 40 giờ sử dụng liên tục, cho phép bạn tận hưởng âm nhạc cả ngày lẫn đêm.",
    },
    {
      icon: <Wifi className="w-10 h-10 text-rose-500" />,
      title: "Kết nối ổn định",
      description: "Bluetooth 5.3 với phạm vi kết nối lên đến 10m, đảm bảo kết nối ổn định và không bị gián đoạn.",
    },
    {
      icon: <Volume2 className="w-10 h-10 text-rose-500" />,
      title: "Chống ồn chủ động",
      description: "Công nghệ chống ồn chủ động tiên tiến, loại bỏ đến 99% tiếng ồn môi trường xung quanh.",
    },
    {
      icon: <Shield className="w-10 h-10 text-rose-500" />,
      title: "Chống nước IPX4",
      description: "Khả năng chống nước IPX4 giúp bảo vệ tai nghe khỏi mồ hôi và mưa nhẹ, phù hợp cho mọi hoạt động.",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-rose-500 transition-colors"
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
