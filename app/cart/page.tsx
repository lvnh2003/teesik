"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/services/core"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import { VoucherService } from "@/services/voucher"

import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items: cartItems, isLoading, updateQuantity, removeFromCart, voucherCode, discountAmount, applyVoucher, removeVoucher } = useCart()
  const { t } = useLanguage()

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  
  const handleUpdateQuantity = (productId: string | number, variantId: string | number | undefined, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, variantId, newQuantity)
  }

  const handleRemoveItem = (productId: string | number, variantId?: string | number) => {
    removeFromCart(productId, variantId)
  }

  const [inputCode, setInputCode] = useState("")
  const [validatingVoucher, setValidatingVoucher] = useState(false)

  const handleApplyVoucher = async () => {
    if (!inputCode.trim()) return
    setValidatingVoucher(true)
    try {
      const res = await VoucherService.validate(inputCode, subtotal)
      if (res.success && res.data) {
        applyVoucher(res.data.code, res.data.discount)
        toast.success(res.message || "Áp dụng mã giảm giá thành công")
        setInputCode("")
      } else {
        toast.error(res.message || "Mã giảm giá không hợp lệ")
      }
    } catch (e: any) {
      toast.error(e?.message || "Lỗi áp dụng mã giảm giá")
    } finally {
      setValidatingVoucher(false)
    }
  }

  const shipping = subtotal > 1000000 ? 0 : 50000
  const total = Math.max(0, subtotal + shipping - discountAmount)

  if (isLoading && cartItems.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">{t("cart.loading")}</div>
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl"
        >
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-24 h-24 text-gray-200 stroke-[1]" />
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] leading-tight font-black tracking-tighter text-black mb-8 uppercase opacity-90 whitespace-pre-line">
            {t("cart.emptyTitle")}
          </h1>
          <p className="text-gray-500 text-lg mb-12 max-w-lg mx-auto font-medium">
            {t("cart.emptyDesc")}
          </p>
          <Link href="/products">
            <Button className="rounded-none bg-black text-white hover:bg-gray-800 px-12 py-8 text-lg uppercase font-bold tracking-widest">
              {t("cart.startShopping")}
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black pb-20">
      {/* Header */}
      <header className="pt-32 pb-12 px-4 md:px-8 container mx-auto border-b border-black/10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] whitespace-pre-line">
          {t("cart.title")}
        </h1>
      </header>

      <div className="container px-4 md:px-8 mx-auto py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            {cartItems.map((item) => (
              <motion.div
                layout
                key={`${item.product_id}-${item.variant_id}`}
                className="flex gap-6 md:gap-12 items-start group"
              >
                <Link href={`/products/${item.product_id}`} className="relative w-32 md:w-48 aspect-[3/4] flex-shrink-0 bg-gray-100 overflow-hidden block">
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="flex-1 flex flex-col min-h-[10rem]">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-bold text-xl md:text-3xl uppercase tracking-tighter leading-none hover:underline decoration-1 underline-offset-4">{item.name}</h3>
                    </Link>
                    <button
                      onClick={() => handleRemoveItem(item.product_id, item.variant_id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 -mr-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-1 mb-6">
                    <p className="font-mono text-lg font-medium">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                    </p>
                    {item.attributes && Object.keys(item.attributes).length > 0 && (
                      <p className="text-xs uppercase tracking-widest text-gray-500">
                        {Object.values(item.attributes).join(" / ")}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 block">{t("cart.quantity")}</label>
                    <div className="flex items-center border border-black w-fit">
                      <button
                        className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        onClick={() => handleUpdateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-sm">{item.quantity}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        onClick={() => handleUpdateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-12 sticky top-32 border border-black/5 shadow-sm">
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">{t("cart.summary")}</h2>

              <div className="space-y-6 mb-8 text-sm uppercase tracking-wider font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>{t("cart.subtotal")}</span>
                  <span className="text-black font-mono">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("cart.shipping")}</span>
                  <span className="text-black font-mono">{shipping === 0 ? t("cart.free") : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 normal-case tracking-normal">{t("cart.shippingNote")}</p>
                )}
                
                {/* Voucher Section */}
                <div className="pt-4 border-t border-black/10">
                  {voucherCode ? (
                    <div className="flex justify-between items-center bg-gray-50 p-3 border border-dashed border-gray-300">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest">Mã áp dụng</span>
                        <span className="font-bold uppercase">{voucherCode}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-600 font-mono">- {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountAmount)}</span>
                        <button onClick={removeVoucher} className="text-red-500 hover:text-red-700 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Mã giảm giá..." 
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="flex-1 border border-black/20 px-3 py-2 text-sm focus:outline-none focus:border-black uppercase bg-transparent"
                      />
                      <Button 
                        onClick={handleApplyVoucher} 
                        disabled={validatingVoucher || !inputCode.trim()}
                        className="bg-black text-white hover:bg-gray-800 rounded-none px-6 uppercase tracking-widest text-xs font-bold"
                      >
                        {validatingVoucher ? '...' : 'Apply'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-black mb-8 pt-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-black uppercase text-xl tracking-tighter">{t("cart.total")}</span>
                  <span className="font-black text-2xl font-mono">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-16 bg-black text-white hover:bg-neutral-800 uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-2 rounded-none transition-all hover:scale-[1.02]">
                  {t("cart.proceedToCheckout")} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
