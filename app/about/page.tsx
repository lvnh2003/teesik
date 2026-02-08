"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight, Award, Globe, Heart, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: t("about.passion"),
      description: t("about.passionDesc"),
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: t("about.quality"),
      description:
        t("about.qualityDesc"),
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("about.global"),
      description: t("about.globalDesc"),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("about.trust"),
      description: t("about.trustDesc"),
    },
  ]

  const team = [
    {
      name: "SARAH JOHNSON",
      role: "FOUNDER & CEO",
      image: "/placeholder.svg?height=600&width=400",
      bio: "With 15 years in fashion design, Sarah founded Teesik to create premium objects for the modern woman.",
    },
    {
      name: "MICHAEL CHEN",
      role: "HEAD OF DESIGN",
      image: "/placeholder.svg?height=600&width=400",
      bio: "Michael brings innovative design concepts and sustainable practices to every collection we create.",
    },
    {
      name: "EMMA WILLIAMS",
      role: "OPERATIONS DIRECTOR",
      image: "/placeholder.svg?height=600&width=400",
      bio: "Emma ensures our global operations run smoothly, from production to customer delivery worldwide.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black pt-24">
      {/* Hero Section */}
      <section className="pb-20 md:pb-32 border-b border-black/10">
        <div className="container px-4 md:px-8 mx-auto">
          <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("about.home")}
          </Link>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-[12vw] lg:text-[10vw] font-black tracking-tighter mb-6 text-black uppercase leading-[0.8] whitespace-pre-line">
                  {t("about.title")}
                </h1>
                <div className="h-2 w-20 bg-black mb-8"></div>
              </motion.div>
            </div>
            <div className="relative">
              <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                {t("about.storyText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Parallax / Large Image */}
      <section className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
        <Image
          src="/images/collection-business.jpg"
          alt="About Teesik Factory"
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-widest border-4 border-white p-8 md:p-12 text-center backdrop-blur-sm">
            {t("about.est")}
          </h2>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 block">{t("about.ourMission")}</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 whitespace-pre-line">
                {t("about.redefiningLuxury")}
              </h2>
            </div>
            <div className="md:col-span-8 md:pl-12 border-l border-white/20">
              <p className="text-2xl md:text-4xl font-light text-white/90 mb-12 leading-tight">
                {t("about.missionText")}
              </p>
              <div className="grid sm:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4">{t("about.sustainable")}</h3>
                  <p className="text-gray-400">{t("about.sustainableDesc")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4">{t("about.transparent")}</h3>
                  <p className="text-gray-400">{t("about.transparentDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 border-b border-black/10">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
            {values.map((value, index) => (
              <div key={index} className="bg-[#FDFBF7] p-12 hover:bg-white transition-colors group h-full">
                <div className="mb-8 p-4 bg-black text-white inline-block rounded-none group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">{value.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-b border-black/10">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "100K+", label: t("about.happyClients") },
              { number: "105", label: t("about.countries") },
              { number: "500+", label: t("about.uniqueProducts") },
              { number: "05", label: t("about.yearsExperience") },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-black">{stat.number}</div>
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">{t("about.theMinds")}</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase leading-none">
                {t("about.ourTeam")}
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-md text-right mt-6 md:mt-0">
              {t("about.meetTeam")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 mb-6 border border-black/5">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-1 text-black uppercase">{member.name}</h3>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">{member.role}</p>
                <div className="h-px w-12 bg-black/20 my-4 group-hover:w-full transition-all duration-500" />
                <p className="text-gray-600 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black text-white text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">
            {t("about.joinMovement")}
          </h2>
          <Link href="/products">
            <Button className="bg-white text-black hover:bg-gray-200 text-lg px-12 py-8 rounded-none uppercase font-bold tracking-widest">
              {t("about.startShopping")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
