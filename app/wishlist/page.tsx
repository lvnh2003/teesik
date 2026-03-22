"use client"

import Link from "next/link"
import Image from "next/image"
import { X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/wishlist-context"
import { getImageUrl } from "@/services/core"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

export default function WishlistPage() {
    const { items, removeItem } = useWishlist()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useLanguage()

    // Dramatic Empty State
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-4xl"
                >
                    <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-black mb-8 uppercase opacity-90">
                        Empty
                        <br />
                        <span className="text-gray-300">Wishlist</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-serif italic mb-12 tracking-wide">
                        "Design is the silent ambassador of your brand."
                    </p>
                    <Link href="/products">
                        <Button className="group relative overflow-hidden bg-black text-white px-12 py-8 rounded-none transition-all duration-300 hover:bg-black">
                            <span className="relative z-10 flex items-center text-lg uppercase tracking-[0.2em] font-medium">
                                Start Curating <ArrowRight className="ml-4 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-neutral-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 will-change-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-black pb-32">
            {/* Editorial Header */}
            <header className="pt-32 pb-20 px-6 container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="border-b border-black/10 pb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                            Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-400">
                                Selection
                            </span>
                        </h1>
                        <div className="flex flex-col items-start md:items-end mb-2">
                            <p className="font-serif italic text-2xl text-gray-500">
                                {items.length} {items.length === 1 ? 'Object' : 'Objects'}
                            </p>
                            <p className="text-xs font-mono uppercase tracking-widest mt-2 border border-black px-2 py-1">
                                Curated Collection
                            </p>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Product Grid */}
            <div className="container mx-auto px-6">
                <AnimatePresence mode='popLayout'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
                        {items.map((product, index) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                                className="group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0] mb-8">
                                    <Link href={`/products/${product.id}`} className="block w-full h-full">
                                        <Image
                                            src={getImageUrl(product.main_image?.image_path || "") || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0 grayscale"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                    </Link>

                                    {/* Floating Actions */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        <button
                                            onClick={(e) => { e.preventDefault(); removeItem(product.id); }}
                                            className="bg-white text-black p-3 hover:bg-black hover:text-white transition-colors duration-300 shadow-xl"
                                            aria-label="Remove"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Add to Bag Overlay Button */}
                                    <div className="absolute bottom-0 left-0 right-0 p-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                                        <Link href={`/products/${product.id}`} className="block">
                                            <Button className="w-full bg-black text-white hover:bg-neutral-800 border-none rounded-none h-14 uppercase tracking-widest font-bold text-xs flex items-center justify-center gap-2">
                                                <ShoppingBag className="h-4 w-4" /> View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col items-start gap-1">
                                    <div className="w-full flex justify-between items-baseline border-b border-black/10 pb-4 mb-4">
                                        <h3 className="text-2xl font-serif italic truncate pr-4 text-black group-hover:text-gray-600 transition-colors">
                                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                                        </h3>
                                        <span className="font-mono text-sm tracking-tight text-black">
                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Simple tags or categories could go here */}
                                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border border-gray-200 px-2 py-1">
                                            In Stock
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>
        </div>
    )
}
