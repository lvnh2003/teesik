import Image from "next/image"
import { ArrowRight, Award, Globe, Heart, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "PASSION",
      description: "We're passionate about creating bags that enhance your lifestyle and express your personality.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "QUALITY",
      description:
        "Every bag is crafted with premium materials and attention to detail that ensures lasting durability.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "GLOBAL",
      description: "We serve customers worldwide with fast shipping and excellent customer service.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "TRUST",
      description: "Built on trust, transparency, and commitment to delivering exceptional products and service.",
    },
  ]

  const team = [
    {
      name: "SARAH JOHNSON",
      role: "FOUNDER & CEO",
      image: "/placeholder.svg?height=400&width=400",
      bio: "With 15 years in fashion design, Sarah founded LuxeBags to create premium handbags for the modern woman.",
    },
    {
      name: "MICHAEL CHEN",
      role: "HEAD OF DESIGN",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Michael brings innovative design concepts and sustainable practices to every collection we create.",
    },
    {
      name: "EMMA WILLIAMS",
      role: "OPERATIONS DIRECTOR",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Emma ensures our global operations run smoothly, from production to customer delivery worldwide.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">ABOUT US</Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase leading-none">
                Our Story
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Founded in 2018, LuxeBags was born from a simple belief: everyone deserves access to premium,
                beautifully designed handbags that enhance their lifestyle and express their unique personality.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                What started as a small passion project has grown into a global brand, serving customers in over 100
                countries with our commitment to quality, design, and exceptional service.
              </p>
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                Our Collections
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src="/images/collection-business.jpg"
                  alt="About LuxeBags"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-black uppercase">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from design to delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-black text-white rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-800 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-4 text-black uppercase">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100K+", label: "HAPPY CUSTOMERS" },
              { number: "100+", label: "COUNTRIES SERVED" },
              { number: "500+", label: "UNIQUE DESIGNS" },
              { number: "5", label: "YEARS OF EXCELLENCE" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-black">{stat.number}</div>
                <div className="text-sm font-medium tracking-wider uppercase text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-black uppercase">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the passionate people behind LuxeBags who make it all possible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative aspect-square overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-2 text-black uppercase">{member.name}</h3>
                <p className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase leading-none">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                To create premium handbags that empower individuals to express their unique style while supporting
                sustainable and ethical business practices.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                We believe that great design should be accessible, sustainable, and meaningful. Every bag we create is a
                step towards a more stylish and conscious world.
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image src="/images/collection-travel.jpg" alt="Our Mission" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
