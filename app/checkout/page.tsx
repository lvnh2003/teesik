"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Smartphone, Mail, Shield, CheckCircle, Smartphone as SmartphoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { OrderService } from "@/services/orders"
import { CartService } from "@/services/cart"
import { getImageUrl } from "@/services/core"
import { useLanguage } from "@/contexts/language-context"
import { CartItem } from "@/type"



export default function CheckoutPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("qr")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestEmail, setGuestEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [orderStep, setOrderStep] = useState("CartService.checkout") // CartService.checkout, payment, success
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await CartService.getCart()
        setCartItems(data.items || [])
        setSubtotal(data.total || 0)
        if (!data.items || data.items.length === 0) {
          router.push('/cart')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [router])

  const shipping = subtotal > 1000000 ? 0 : 50000
  const total = subtotal + shipping

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
      console.log("Sending OTP to:", guestEmail)
    }
  }

  const handleVerifyOtp = () => {
    if (otp) {
      setOrderStep("payment")
    }
  }

  const handlePayment = async () => {
    try {
      const result = await CartService.checkout({
        customer_name: customerName,
        customer_email: guestEmail || 'user@example.com',
        address: `${address}, ${district}, ${city}`,
        phone: phone,
        payment_method: paymentMethod
      })

      if (result.success && result.order) {
        // Process mock payment
        try {
          if (paymentMethod !== 'cod') { // Assuming COD doesn't need immediate payment processing
            await OrderService.processPayment(result.order.id, paymentMethod)
          }
          setOrderStep("success")
        } catch (paymentError) {
          console.error("Payment failed", paymentError)
          alert("Đặt hàng thành công nhưng thanh toán thất bại. Vui lòng liên hệ bộ phận CSKH.")
          setOrderStep("success") // Still show success as order was created
        }
      } else {
        alert("Dữ liệu trả về không hợp lệ")
      }
    } catch (e: any) {
      console.error(e)
      alert("Có lỗi xảy ra khi thanh toán: " + (e.message || "Lỗi không xác định"))
    }
  }

  if (isLoading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">{t("CartService.checkout.loading")}</div>

  // Success Page
  if (orderStep === "success") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle className="h-16 w-16 text-black mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-black uppercase leading-none">{t("CartService.checkout.orderConfirmed")}</h1>
          <p className="text-gray-600 mb-8 font-medium">
            {t("CartService.checkout.thankYou")}
          </p>
          <div className="bg-[#FDFBF7] p-6 mb-8 border border-black/10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{t("CartService.checkout.orderNumber")}</p>
            <p className="font-mono text-2xl font-bold">#{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <Link href="/products">
            <Button className="w-full h-14 bg-black hover:bg-neutral-800 text-white rounded-none uppercase font-bold tracking-widest text-sm">
              {t("CartService.checkout.continueShopping")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black pb-20">
      {/* Header */}
      <header className="pt-24 pb-12 px-4 md:px-8 border-b border-black/10">
        <div className="container mx-auto">
          <Link href="/cart" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("CartService.checkout.returnToBag")}
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {t("CartService.checkout.title")}
          </h1>
        </div>
      </header>

      <div className="container px-4 md:px-8 mx-auto py-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7">
            {orderStep === "CartService.checkout" && (
              <div className="space-y-12">
                {/* 1. Identity */}
                <section>
                  <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                    <h2 className="text-2xl font-black tracking-tighter uppercase">{t("CartService.checkout.identity")}</h2>
                    <Badge className="rounded-none bg-black text-white hover:bg-black font-mono font-normal">
                      {isLoggedIn ? t("CartService.checkout.loggedIn") : t("CartService.checkout.guest")}
                    </Badge>
                  </div>

                  {!isLoggedIn ? (
                    <Tabs defaultValue="guest" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 bg-transparent p-0 mb-8 rounded-none border border-black">
                        <TabsTrigger value="guest" className="rounded-none border-r border-black data-[state=active]:bg-black data-[state=active]:text-white h-12 font-bold uppercase tracking-wider text-xs">{t("CartService.checkout.guestCheckout")}</TabsTrigger>
                        <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white h-12 font-bold uppercase tracking-wider text-xs">{t("CartService.checkout.memberLogin")}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="guest" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">{t("CartService.checkout.emailLabel")}</Label>
                            <Input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder={t("CartService.checkout.emailPlaceholder")}
                              className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="login">
                        <div className="text-center py-8 border border-dashed border-black/30">
                          <p className="text-gray-500 mb-4">{t("CartService.checkout.signInDesc")}</p>
                          <Link href="/account">
                            <Button className="rounded-none bg-black text-white px-8 uppercase font-bold tracking-widest text-xs h-10">{t("CartService.checkout.signIn")}</Button>
                          </Link>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="p-4 bg-gray-100 border-l-4 border-black">
                      <p className="font-mono text-sm">Logged in as: <span className="font-bold">user@example.com</span></p>
                    </div>
                  )}
                </section>

                {/* 2. Shipping */}
                <section>
                  <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                    <h2 className="text-2xl font-black tracking-tighter uppercase">{t("CartService.checkout.shipping")}</h2>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest">Full Name</Label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Phone Number</Label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">City</Label>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">District</Label>
                        <Input
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Address</Label>
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    {!showOtpInput ? (
                      <Button
                        onClick={handleSendOtp}
                        className="w-full bg-black hover:bg-neutral-800 text-white h-14 rounded-none uppercase font-bold tracking-widest text-sm"
                        disabled={!guestEmail || !customerName || !phone || !address}
                      >
                        {t("CartService.checkout.verifyAndContinue")}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-6 bg-black text-white">
                          <Label className="text-xs font-bold uppercase tracking-widest text-white/70">{t("CartService.checkout.enterCode")}</Label>
                          <Input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-2 h-16 border-b-2 border-white border-t-0 border-x-0 bg-transparent text-center text-4xl tracking-[0.5em] font-mono focus-visible:ring-0 placeholder:text-white/20"
                            maxLength={6}
                          />
                          <p className="text-xs text-white/50 mt-4 text-center">{t("CartService.checkout.codeSentTo").replace("{email}", guestEmail)}</p>
                        </div>
                        <Button
                          onClick={handleVerifyOtp}
                          className="w-full bg-white text-black border border-black hover:bg-black hover:text-white h-14 rounded-none uppercase font-bold tracking-widest text-sm transition-colors"
                          disabled={otp.length !== 6}
                        >
                          {t("CartService.checkout.confirmCode")}
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {orderStep === "payment" && (
              <section>
                <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                  <h2 className="text-2xl font-black tracking-tighter uppercase">{t("CartService.checkout.payment")}</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <Label
                    htmlFor="qr"
                    className={`flex items-start space-x-4 p-6 border transition-all cursor-pointer ${paymentMethod === 'qr' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                  >
                    <RadioGroupItem value="qr" id="qr" className="mt-1 border-white" />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <SmartphoneIcon className="h-5 w-5 mr-2" />
                        <span className="font-bold uppercase tracking-wider">{t("CartService.checkout.qrPayment")}</span>
                      </div>
                      <p className={`text-sm ${paymentMethod === 'qr' ? 'text-white/70' : 'text-gray-500'}`}>{t("CartService.checkout.qrDesc")}</p>

                      {paymentMethod === 'qr' && (
                        <div className="mt-6 p-4 bg-white max-w-[200px] mx-auto text-black text-center">
                          <div className="aspect-square bg-gray-100 mb-2 relative">
                            <Image
                              src={`https://img.vietqr.io/image/970436-0987654321-qr_only.png?amount=${total}&addInfo=TEESIK&accountName=TEESIK%20STORE`}
                              alt="QR Code"
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <p className="font-mono font-bold text-lg">{formatPrice(total)}</p>
                        </div>
                      )}
                    </div>
                  </Label>

                  <Label
                    htmlFor="card"
                    className={`flex items-start space-x-4 p-6 border transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                  >
                    <RadioGroupItem value="card" id="card" className="mt-1 border-white" />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span className="font-bold uppercase tracking-wider">{t("CartService.checkout.creditCard")}</span>
                      </div>
                      <p className={`text-sm ${paymentMethod === 'card' ? 'text-white/70' : 'text-gray-500'}`}>{t("CartService.checkout.cardDesc")}</p>

                      {paymentMethod === 'card' && (
                        <div className="mt-6 space-y-4">
                          <Input placeholder={t("CartService.checkout.cardNumber")} className="bg-white text-black h-12 rounded-none border-none" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="MM/YY" className="bg-white text-black h-12 rounded-none border-none" />
                            <Input placeholder="CVC" className="bg-white text-black h-12 rounded-none border-none" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Label>
                </RadioGroup>

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-8">
                  <Shield className="h-4 w-4" /> {t("CartService.checkout.secureSsl")}
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-black hover:bg-neutral-800 text-white h-16 text-lg font-bold tracking-widest uppercase rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {t("CartService.checkout.completeOrder")}
                </Button>
              </section>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-black/10 p-8 sticky top-32">
              <h3 className="text-xl font-black tracking-tighter uppercase mb-6">{t("CartService.checkout.orderSummary")}</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-20 aspect-[3/4] bg-gray-100 flex-shrink-0">
                      <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm uppercase truncate mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {item.color} {item.size ? `• ${item.size}` : ''}
                      </p>
                      <p className="font-mono text-sm font-medium">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-6 space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-wider text-xs font-sans font-bold">{t("cart.subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-wider text-xs font-sans font-bold">{t("cart.shipping")}</span>
                  <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-black items-end">
                  <span className="text-black uppercase tracking-wider text-sm font-sans font-black">{t("cart.total")}</span>
                  <span className="text-2xl font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
