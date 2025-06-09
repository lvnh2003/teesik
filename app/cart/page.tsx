"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "MILANO TOTE",
      price: 1290000,
      image: "/images/tote-bag-1.jpg",
      quantity: 1,
      color: "Black",
      size: "Medium",
    },
    {
      id: 2,
      name: "PARIS CROSSBODY",
      price: 890000,
      image: "/images/crossbody-bag-1.jpg",
      quantity: 2,
      color: "Brown",
      size: "Small",
    },
    {
      id: 3,
      name: "TOKYO BACKPACK",
      price: 1490000,
      image: "/images/backpack-1.jpg",
      quantity: 1,
      color: "Navy",
      size: "Large",
    },
  ])

  const [promoCode, setPromoCode] = useState("")

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000000 ? 0 : 50000
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container px-4 mx-auto py-20">
          <div className="text-center max-w-2xl mx-auto">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-black uppercase">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg font-medium tracking-wider uppercase"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 border-b border-gray-200">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">SHOPPING CART</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">Your Cart</h1>
          <p className="text-xl text-gray-600">Review your items and proceed to checkout</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 border border-gray-200 bg-gray-50">
                  <div className="relative w-32 h-32 bg-white">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase">{item.name}</h3>
                        <p className="text-gray-600">
                          {item.color} • {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-l border-r border-gray-300 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xl font-bold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-medium tracking-wider uppercase"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-8">
              <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && <p className="text-sm text-green-600">🎉 You qualify for free shipping!</p>}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-sm font-medium tracking-wider uppercase mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                    Apply
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-medium tracking-wider uppercase mb-4"
              >
                Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Secure checkout with SSL encryption</p>
                <p className="mt-2">Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
