"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, CreditCard, Smartphone, Mail, Shield, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Simulate login status
  const [paymentMethod, setPaymentMethod] = useState("qr")
  const [guestEmail, setGuestEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [orderStep, setOrderStep] = useState("checkout") // checkout, payment, success

  // Mock cart items
  const cartItems = [
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
      quantity: 1,
      color: "Brown",
      size: "Small",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSendOtp = () => {
    if (guestEmail) {
      setShowOtpInput(true)
      // Simulate sending OTP
      console.log("Sending OTP to:", guestEmail)
    }
  }

  const handleVerifyOtp = () => {
    if (otp) {
      setOrderStep("payment")
    }
  }

  const handlePayment = () => {
    setOrderStep("success")
  }

  // Success Page
  if (orderStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 shadow-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black tracking-tighter mb-4 text-black uppercase">Đặt Hàng Thành Công!</h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng và giao hàng trong thời gian sớm nhất.
          </p>
          <div className="bg-gray-50 p-4 mb-6">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="font-bold text-lg">#LB2024001</p>
          </div>
          <Link href="/products">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">Tiếp Tục Mua Sắm</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container px-4 mx-auto py-6">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại giỏ hàng
            </Link>
            <h1 className="text-2xl font-black tracking-tighter text-black uppercase">Thanh Toán</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Checkout Form */}
          <div>
            {orderStep === "checkout" && (
              <div className="space-y-8">
                {/* Login Status */}
                <div className="bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tighter uppercase">Thông Tin Khách Hàng</h2>
                    <Badge className={isLoggedIn ? "bg-green-500" : "bg-gray-500"}>
                      {isLoggedIn ? "Đã đăng nhập" : "Khách"}
                    </Badge>
                  </div>

                  {!isLoggedIn ? (
                    <Tabs defaultValue="guest" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="guest">Mua hàng không cần đăng nhập</TabsTrigger>
                        <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                      </TabsList>

                      <TabsContent value="guest">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium tracking-wider uppercase">Email *</Label>
                            <div className="relative mt-2">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                className="pl-12 h-12 border-2 border-gray-200 focus:border-black"
                                required
                              />
                            </div>
                          </div>

                          {!showOtpInput ? (
                            <Button
                              onClick={handleSendOtp}
                              className="w-full bg-black hover:bg-gray-800 text-white h-12"
                              disabled={!guestEmail}
                            >
                              Gửi mã OTP
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium tracking-wider uppercase">Mã OTP *</Label>
                                <Input
                                  type="text"
                                  placeholder="Nhập mã 6 số"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  className="mt-2 h-12 border-2 border-gray-200 focus:border-black text-center text-lg tracking-widest"
                                  maxLength={6}
                                />
                                <p className="text-sm text-gray-600 mt-2">Mã OTP đã được gửi đến {guestEmail}</p>
                              </div>
                              <Button
                                onClick={handleVerifyOtp}
                                className="w-full bg-black hover:bg-gray-800 text-white h-12"
                                disabled={otp.length !== 6}
                              >
                                Xác thực OTP
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="login">
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">Đăng nhập để thanh toán nhanh hơn</p>
                          <Link href="/account">
                            <Button className="bg-black hover:bg-gray-800 text-white">Đăng Nhập</Button>
                          </Link>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="bg-green-50 p-4 border border-green-200">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-700">Đã đăng nhập với email: user@example.com</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Information */}
                <div className="bg-white p-6 shadow-lg">
                  <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Thông Tin Giao Hàng</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium tracking-wider uppercase">Họ *</Label>
                      <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium tracking-wider uppercase">Tên *</Label>
                      <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium tracking-wider uppercase">Số điện thoại *</Label>
                      <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium tracking-wider uppercase">Địa chỉ *</Label>
                      <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium tracking-wider uppercase">Thành phố *</Label>
                        <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium tracking-wider uppercase">Quận/Huyện *</Label>
                        <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium tracking-wider uppercase">Mã bưu điện</Label>
                        <Input className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setOrderStep("payment")}
                  className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg font-medium tracking-wider uppercase"
                  disabled={!isLoggedIn && (!showOtpInput || otp.length !== 6)}
                >
                  Tiếp Tục Thanh Toán
                </Button>
              </div>
            )}

            {orderStep === "payment" && (
              <div className="space-y-8">
                <div className="bg-white p-6 shadow-lg">
                  <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Phương Thức Thanh Toán</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    {isLoggedIn && (
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 hover:border-black transition-colors">
                        <RadioGroupItem value="qr" id="qr" />
                        <Label htmlFor="qr" className="flex items-center cursor-pointer flex-1">
                          <Smartphone className="h-5 w-5 mr-3" />
                          <div>
                            <p className="font-medium">Thanh toán QR Code</p>
                            <p className="text-sm text-gray-600">Quét mã QR để thanh toán nhanh</p>
                          </div>
                        </Label>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-4 border border-gray-200 hover:border-black transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 mr-3" />
                        <div>
                          <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* QR Payment */}
                  {paymentMethod === "qr" && isLoggedIn && (
                    <div className="mt-6 text-center">
                      <div className="bg-gray-50 p-8 inline-block">
                        <div className="w-48 h-48 bg-white border-2 border-gray-300 flex items-center justify-center mb-4">
                          <Image
                            src="/placeholder.svg?height=180&width=180"
                            alt="QR Code"
                            width={180}
                            height={180}
                            className="opacity-50"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Quét mã QR để thanh toán</p>
                        <p className="font-bold text-lg">{formatPrice(total)}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Mã QR sẽ hết hạn sau 10:00
                      </div>
                    </div>
                  )}

                  {/* Card Payment */}
                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label className="text-sm font-medium tracking-wider uppercase">Số thẻ *</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          className="mt-2 h-12 border-2 border-gray-200 focus:border-black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium tracking-wider uppercase">Ngày hết hạn *</Label>
                          <Input
                            placeholder="MM/YY"
                            className="mt-2 h-12 border-2 border-gray-200 focus:border-black"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium tracking-wider uppercase">CVV *</Label>
                          <Input placeholder="123" className="mt-2 h-12 border-2 border-gray-200 focus:border-black" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium tracking-wider uppercase">Tên trên thẻ *</Label>
                        <Input
                          placeholder="NGUYEN VAN A"
                          className="mt-2 h-12 border-2 border-gray-200 focus:border-black"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-600 bg-white p-4 shadow-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  Thông tin thanh toán của bạn được bảo mật với mã hóa SSL 256-bit
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg font-medium tracking-wider uppercase"
                >
                  Hoàn Tất Thanh Toán - {formatPrice(total)}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Đơn Hàng Của Bạn</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.color} • {item.size}
                      </p>
                      <p className="font-bold text-sm">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
