export default function StatsSection() {
  const stats = [
    {
      number: "100+",
      label: "Quốc gia",
      description: "Giao hàng toàn cầu",
    },
    {
      number: "5000+",
      label: "Đối tác dropship",
      description: "Trên toàn thế giới",
    },
    {
      number: "200+",
      label: "Mẫu túi xách",
      description: "Đa dạng phong cách",
    },
    {
      number: "50K+",
      label: "Đơn hàng",
      description: "Mỗi tháng",
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">CON SỐ ẤN TƯỢNG</h2>
          <p className="text-gray-300 text-lg">Những thành tựu chúng tôi đã đạt được</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="font-semibold text-lg mb-1">{stat.label}</p>
                <p className="text-gray-400 text-sm">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
