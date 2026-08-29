"use client"

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, Smartphone as SmartphoneIcon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { OrderService } from "@/services/orders";
import { CartService } from "@/services/cart";
import { getImageUrl } from "@/services/core";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { CartItem, Order } from "@/type";
import { formatAttributeValue } from "@/lib/utils"
import { AddressService, UserAddress } from "@/services/address";
import { ShippingService, Province, District, Ward } from "@/services/shipping";
import { toast } from "sonner";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";

export default function CheckoutPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn: authLoggedIn, user } = useAuth()
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [guestEmail, setGuestEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [orderStep, setOrderStep] = useState("checkout") // checkout, payment, success
  const { items: cartItems, isLoading, refreshCart, clearCart, voucherCode, discountAmount } = useCart()
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const [orderId, setOrderId] = useState<string | number | null>(null)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [momoPayment, setMomoPayment] = useState<{
    orderId: number;
    qrCodeUrl?: string | null;
    deeplink?: string | null;
    paymentToken: string;
  } | null>(null)
  const [qrPayment, setQrPayment] = useState<{
    orderId: number;
    qrCodeUrl?: string | null;
    paymentCode?: string;
    amount?: number;
    paymentToken: string;
  } | null>(null)
  const [momoReturnHandled, setMomoReturnHandled] = useState(false)
  
  // Shipping & Addresses
  const [shippingFee, setShippingFee] = useState(0)
  const total = Math.max(0, subtotal + shippingFee - discountAmount)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | 0>(0)
  
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  
  const [guestAddress, setGuestAddress] = useState({
    province_id: 0, province: '',
    district_id: 0, district: '',
    ward_code: '', ward: '',
    specific_address: ''
  })
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Detect login and fetch data
  useEffect(() => {
    // Always fetch provinces once
    if (provinces.length === 0) {
      ShippingService.getProvinces().then(res => {
        if (res.success) setProvinces(res.data)
      }).catch(console.error)
    }

    if (authLoggedIn && user) {
      setIsLoggedIn(true)
      if (user.name) setCustomerName(prev => prev || user.name)
      if (user.email) setGuestEmail(prev => prev || user.email)
      
      // Only fetch addresses if not already loaded or empty
      if (addresses.length === 0) {
        AddressService.getAddresses().then(res => {
          if (res.success && res.data.length > 0) {
              setAddresses(res.data)
              const defaultAddr = res.data.find(a => a.is_default) || res.data[0]
              setSelectedAddressId(prev => prev === 0 ? defaultAddr.id : prev)
              
              // Also populate customer info from address if empty
              setCustomerName(prev => prev || defaultAddr.receiver_name)
              setPhone(prev => prev || defaultAddr.phone)
          }
        }).catch(console.error)
      }
    }
  }, [authLoggedIn, user?.id]) // Use user.id for better stability

  // Shipping Fee live calculation
  useEffect(() => {
    if (subtotal === 0) {
      setShippingFee(0)
      setIsCalculatingShipping(false)
      return
    }

    // Free ship for orders over 1,000,000 VND
    if (subtotal > 1000000) {
      setShippingFee(0)
      setIsCalculatingShipping(false)
      return
    }

    let pDistId = 0
    let pWardCode = ""

    if (isLoggedIn && selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId)
      if (addr) {
        pDistId = addr.district_id
        pWardCode = addr.ward_code
      }
    } else if (!isLoggedIn) {
      pDistId = guestAddress.district_id
      pWardCode = guestAddress.ward_code
    }

    if (!pDistId || !pWardCode) {
      setShippingFee(0)
      setIsCalculatingShipping(false)
      return
    }

    const abortController = new AbortController();
    
    const timer = setTimeout(() => {
      setIsCalculatingShipping(true)

      
      ShippingService.calculateFee(pDistId, pWardCode, subtotal, 300, abortController.signal)
        .then(res => {
          if (res.data && typeof res.data.fee === 'number') {

            setShippingFee(res.data.fee)
          } else {
            console.warn(`[Shipping] Unexpected response, falling back to 30k`, res);
            setShippingFee(30000)
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError' || err.message?.includes('cancelled')) {

            return;
          }
          console.error(`[Shipping] Error calculating fee, falling back to 30k`, err);
          setShippingFee(30000)
        })
        .finally(() => {
          // Only set to false if this request wasn't aborted
          if (!abortController.signal.aborted) {
            setIsCalculatingShipping(false)
          }
        })
    }, 500) // 500ms debounce

    return () => {
      clearTimeout(timer)
      abortController.abort()
    }
  }, [isLoggedIn, selectedAddressId, guestAddress.district_id, guestAddress.ward_code, subtotal])

  // Guest Address Handling
  const handleGuestProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = parseInt(e.target.value) || 0
    const provName = e.target.options[e.target.selectedIndex].text
    setGuestAddress(p => ({ ...p, province_id: provId, province: provName, district_id: 0, district: '', ward_code: '', ward: '' }))
    setDistricts([]); setWards([]);
    if (provId) {
      const res = await ShippingService.getDistricts(provId)
      if (res.success) setDistricts(res.data)
    }
  }

  const handleGuestDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = parseInt(e.target.value) || 0
    const distName = e.target.options[e.target.selectedIndex].text
    setGuestAddress(p => ({ ...p, district_id: distId, district: distName, ward_code: '', ward: '' }))
    setWards([]);
    if (distId) {
      const res = await ShippingService.getWards(distId)
      if (res.success) setWards(res.data)
    }
  }

  // Redirect if empty
  useEffect(() => {
    const isMomoReturn = searchParams.has("partnerCode") && searchParams.has("signature")
    if (!isMomoReturn && !isLoading && orderStep !== "success" && (!cartItems || cartItems.length === 0)) {
      router.push('/cart')
    }
  }, [isLoading, cartItems, orderStep, router, searchParams])

  useEffect(() => {
    if (momoReturnHandled || !searchParams.has("partnerCode") || !searchParams.has("signature")) return

    setMomoReturnHandled(true)
    const params = new URLSearchParams(searchParams.toString())
    OrderService.verifyMomoReturn(params)
      .then(res => {
        if (res.success && res.data?.payment_status === "paid") {
          setOrderId(res.data.order_id)
          clearCart()
          setOrderStep("success")
          toast.success(t("checkout.momoConfirmed"))
        } else {
          setOrderStep("payment")
          toast.error(res.message || t("checkout.momoIncomplete"))
        }
      })
      .catch((e) => {
        setOrderStep("payment")
        toast.error(e.message || t("checkout.momoVerifyError"))
      })
  }, [searchParams, clearCart, momoReturnHandled, t])

  // Handle checkout flow
  const handleProceedToPayment = () => {
    setIsSubmitting(true)
    // Small delay for visual feedback
    setTimeout(() => {
      if (isLoggedIn) {
        if (selectedAddressId && customerName && phone) setOrderStep("payment")
      } else {
        if (customerName && phone && guestAddress.specific_address && guestAddress.ward_code) setOrderStep("payment")
      }
      setIsSubmitting(false)
    }, 500)
  }

  const handlePayment = async () => {
    try {
      let finalAddress = ''
      if (isLoggedIn && selectedAddressId) {
        const addr = addresses.find(a => a.id === selectedAddressId)
        finalAddress = addr ? `${addr.specific_address}, ${addr.ward}, ${addr.district}, ${addr.province}` : ''
      } else {
        finalAddress = `${guestAddress.specific_address}, ${guestAddress.ward}, ${guestAddress.district}, ${guestAddress.province}`
      }

      setIsSubmitting(true)
      const result = await OrderService.createOrder({
        customer_name: customerName,
        customer_email: guestEmail,
        shipping_address: finalAddress,
        customer_phone: phone,
        payment_method: paymentMethod,
        selected_address_id: isLoggedIn && selectedAddressId ? selectedAddressId : undefined,
        district_id: !isLoggedIn ? guestAddress.district_id : undefined,
        ward_code: !isLoggedIn ? guestAddress.ward_code : undefined,
        voucher_code: voucherCode || "",
        items: cartItems.map(item => ({
            product_id: String(item.product_id),
            variation_id: item.variant_id ? String(item.variant_id) : undefined,
            quantity: item.quantity
        }))
      })

      if (result.success && result.data) {
        const paymentToken = result.data.payment_access_token
        if (!paymentToken) {
          toast.error(t("checkout.error"))
          return
        }

        if (paymentMethod.toLowerCase() === "qr") {
          const payment = await OrderService.processPayment(Number(result.data.id), "qr", paymentToken)
          const paymentData = payment.data

          setOrderId(result.data.id)
          setCreatedOrder(result.data)

          if (paymentData?.qr_code_url) {
            setQrPayment({
              orderId: Number(result.data.id),
              qrCodeUrl: paymentData.qr_code_url,
              paymentCode: paymentData.payment_code,
              amount: paymentData.amount,
              paymentToken,
            })
            toast.info(t("checkout.qrAwaiting"))
            return
          }

          toast.error(payment.message || t("checkout.qrNoUrl"))
          return
        }

        if (paymentMethod.toLowerCase() === "momo") {
          const payment = await OrderService.processPayment(Number(result.data.id), "momo", paymentToken)
          const paymentData = payment.data

          setOrderId(result.data.id)
          setCreatedOrder(result.data)

          if (paymentData?.pay_url) {
            window.location.href = paymentData.pay_url
            return
          }

          if (paymentData?.qr_code_url || paymentData?.deeplink) {
            setMomoPayment({
              orderId: Number(result.data.id),
              qrCodeUrl: paymentData.qr_code_url,
              deeplink: paymentData.deeplink,
              paymentToken,
            })
            toast.info(t("checkout.momoPending"))
            return
          }

          toast.error(payment.message || t("checkout.momoNoUrl"))
          return
        }

        if (paymentMethod.toLowerCase() !== "cod") {
          await OrderService.processPayment(Number(result.data.id), paymentMethod, paymentToken)
        }

        setOrderId(result.data.id)
        setCreatedOrder(result.data)
        clearCart()

        setOrderStep("success")
      } else {
        toast.error(t("checkout.invalidData") || "Please enter all shipping information")
      }
    } catch (e: any) {
      console.error(e)
      toast.error(`${t("checkout.error")}: ${e.message || t("checkout.unknownError")}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckQrPayment = async () => {
    if (!qrPayment?.orderId || !qrPayment.paymentToken) return

    try {
      setIsSubmitting(true)
      const res = await OrderService.getPaymentStatus(qrPayment.orderId, qrPayment.paymentToken)
      if (res.success && res.data?.payment_status === "paid") {
        setOrderId(res.data.order_id)
        clearCart()
        setOrderStep("success")
        toast.success(t("checkout.qrConfirmed"))
      } else {
        toast.info(t("checkout.qrNotConfirmed"))
      }
    } catch (e: any) {
      toast.error(`${t("checkout.error")}: ${e.message || t("checkout.unknownError")}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load order history
  useEffect(() => {
    if (orderStep === "success" && authLoggedIn) {
      OrderService.getUserOrders().then(res => {
        if (res.data && Array.isArray(res.data)) setOrders(res.data)
      }).catch(console.error)
    }
  }, [orderStep, authLoggedIn])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(price)
  }

  if (!hasMounted) return null;

  if (orderStep === "success") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CheckCircle className="h-16 w-16 text-black mx-auto mb-6" />
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-black uppercase leading-none">{t("checkout.orderConfirmed")}</h1>
          <p className="text-gray-600 mb-8 font-medium">{t("checkout.thankYou")}</p>

          {(createdOrder || orders.length > 0) && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">{t("checkout.orderHistory")}</h2>
              <ul className="space-y-4">
                {[createdOrder || orders[0]].filter(Boolean).map((order, index) => (
                  <li key={index} className="border border-gray-200 p-4 rounded text-left">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold">{t("checkout.orderId")} #{order.id}</strong>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>{t("checkout.subtotal") || "Tạm tính"}:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                      </div>
                      {(order.shipping_fee ?? 0) > 0 && (
                        <div className="flex justify-between">
                          <span>{t("checkout.shipping") || "Phí vận chuyển"}:</span>
                          <span>{formatPrice(order.shipping_fee ?? 0)}</span>
                        </div>
                      )}
                      {(order.discount_amount ?? 0) > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>{t("checkout.discount") || "Giảm giá"}:</span>
                          <span>-{formatPrice(order.discount_amount ?? 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t border-black/10 pt-1">
                        <span>{t("checkout.grand_total") || "Tổng thanh toán"}:</span>
                        <span>{formatPrice(order.grand_total || order.cod || order.total_amount)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <Link href="/products">
              <Button className="w-full h-14 bg-black hover:bg-neutral-800 text-white rounded-none uppercase font-bold tracking-widest text-sm">
                {t("checkout.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black pb-20">
      <header className="pt-24 pb-12 px-4 md:px-8 border-b border-black/10">
        <div className="container mx-auto">
          <Link href="/cart" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("checkout.returnToBag")}
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {t("checkout.title")}
          </h1>
        </div>
      </header>

      <div className="container px-4 md:px-8 mx-auto py-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7">
            {orderStep === "checkout" && (
              <div className="space-y-12">
                <section>
                  <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                    <h2 className="text-2xl font-black tracking-tighter uppercase">{t("checkout.identity")}</h2>
                    <Badge className="rounded-none bg-black text-white hover:bg-black font-mono font-normal">
                      {isLoggedIn ? t("checkout.loggedIn") : t("checkout.guest")}
                    </Badge>
                  </div>

                  {!isLoggedIn ? (
                    <Tabs defaultValue="guest" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 bg-transparent p-0 mb-8 rounded-none border border-black">
                        <TabsTrigger value="guest" className="rounded-none border-r border-black data-[state=active]:bg-black data-[state=active]:text-white h-12 font-bold uppercase tracking-wider text-xs">{t("checkout.guestCheckout")}</TabsTrigger>
                        <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white h-12 font-bold uppercase tracking-wider text-xs">{t("checkout.memberLogin")}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="guest" className="space-y-6">
                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.emailLabel")}</Label>
                            <Input
                              type="email"
                              value={guestEmail}
                              onChange={(e) => setGuestEmail(e.target.value)}
                              placeholder={t("checkout.emailPlaceholder")}
                              className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="login">
                        <div className="text-center py-8 border border-dashed border-black/30">
                          <p className="text-gray-500 mb-4">{t("checkout.signInDesc")}</p>
                          <Link href="/account">
                            <Button className="rounded-none bg-black text-white px-8 uppercase font-bold tracking-widest text-xs h-10">{t("checkout.signIn")}</Button>
                          </Link>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="p-4 bg-gray-100 border-l-4 border-black flex justify-between items-center">
                      <div className="font-mono text-sm space-y-1">
                        <p>{t("checkout.loggedInAs")}: <span className="font-bold">{user?.email || "user@example.com"}</span></p>
                        <p>{t("checkout.phoneNumber")}: <span className="font-bold">{user?.phone || t("checkout.noPhone") || "N/A"}</span></p>
                      </div>
                      <Link href="/dashboard/addresses" className="text-xs font-bold uppercase tracking-widest underline hover:text-gray-600">{t("checkout.manageAddresses")}</Link>
                    </div>
                  )}
                </section>

                <section>
                  <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                    <h2 className="text-2xl font-black tracking-tighter uppercase">{t("checkout.shipping")}</h2>
                  </div>

                  {isLoggedIn && addresses.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.selectAddress")}</Label>
                      <RadioGroup value={selectedAddressId ? String(selectedAddressId) : ""} onValueChange={v => {
                        const sId = parseInt(v)
                        setSelectedAddressId(sId)
                        const addr = addresses.find(a => a.id === sId)
                        if (addr) {
                            setCustomerName(addr.receiver_name)
                            setPhone(addr.phone)
                        }
                      }}>
                        {addresses.map(addr => (
                          <Label key={addr.id} htmlFor={`addr-${addr.id}`} className={`flex items-start space-x-4 p-4 border transition-all cursor-pointer ${selectedAddressId === addr.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                            <RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} className="mt-1" />
                            <div className="flex-1">
                              <p className="font-bold">{addr.receiver_name} - {addr.phone}</p>
                              <p className="text-sm text-gray-600 mt-1">{addr.specific_address}, {addr.ward}, {addr.district}, {addr.province}</p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.fullName")}</Label>
                          <Input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.phoneNumber")}</Label>
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.province")}</Label>
                          <select 
                            value={guestAddress.province_id} 
                            onChange={handleGuestProvinceChange}
                            className="w-full h-12 border border-black bg-transparent px-3 text-sm focus:outline-none focus:border-2"
                          >
                            <option value="">-- {t("checkout.selectProvince")} --</option>
                            {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.province_name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.district")}</Label>
                          <select 
                            value={guestAddress.district_id} 
                            onChange={handleGuestDistrictChange}
                            disabled={!guestAddress.province_id}
                            className="w-full h-12 border border-black bg-transparent px-3 text-sm focus:outline-none focus:border-2"
                          >
                            <option value="">-- {t("checkout.selectDistrict")} --</option>
                            {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.district_name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.ward")}</Label>
                          <select 
                            value={guestAddress.ward_code} 
                            onChange={e => setGuestAddress(p => ({...p, ward_code: e.target.value, ward: e.target.options[e.target.selectedIndex].text}))}
                            disabled={!guestAddress.district_id}
                            className="w-full h-12 border border-black bg-transparent px-3 text-sm focus:outline-none focus:border-2"
                          >
                            <option value="">-- {t("checkout.selectWard")} --</option>
                            {wards.map(w => <option key={w.ward_code} value={w.ward_code}>{w.ward_name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest">{t("checkout.addressNote")}</Label>
                          <Input
                            value={guestAddress.specific_address}
                            onChange={(e) => setGuestAddress(p => ({...p, specific_address: e.target.value}))}
                            placeholder={t("checkout.addressPlaceholder")}
                            className="rounded-none border-black h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      onClick={handleProceedToPayment}
                      className="w-full bg-black hover:bg-neutral-800 text-white h-14 rounded-none uppercase font-bold tracking-widest text-sm"
                      disabled={isSubmitting || (authLoggedIn 
                        ? ((!selectedAddressId && (!guestAddress.specific_address || !guestAddress.ward_code)) || !customerName || !phone) 
                        : (!customerName || !phone || !guestAddress.specific_address || !guestAddress.ward_code))}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t("checkout.processing")}</span>
                        </div>
                      ) : (
                        t("checkout.verifyAndContinue")
                      )}
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {orderStep === "payment" && (
              <section>
                <div className="flex items-center justify-between mb-8 border-b border-black pb-4">
                  <h2 className="text-2xl font-black tracking-tighter uppercase">{t("checkout.payment")}</h2>
                  <Button variant="link" onClick={() => setOrderStep('checkout')} className="uppercase font-bold tracking-widest text-xs">{t("checkout.editAddress")}</Button>
                </div>

                <PaymentMethods
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  setMomoPayment={setMomoPayment}
                  setQrPayment={setQrPayment}
                  qrPayment={qrPayment}
                  momoPayment={momoPayment}
                  total={total}
                  formatPrice={formatPrice}
                  handleCheckQrPayment={handleCheckQrPayment}
                  isSubmitting={isSubmitting}
                  t={t}
                />

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-8">
                  <Shield className="h-4 w-4" /> {t("checkout.secureSsl")}
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-neutral-800 text-white h-16 text-lg font-bold tracking-widest uppercase rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("checkout.processing")}</span>
                    </div>
                  ) : (
                    t("checkout.completeOrder")
                  )}
                </Button>
              </section>
            )}
          </div>

          <div className="lg:col-span-5">
              <OrderSummary 
                cartItems={cartItems}
                subtotal={subtotal}
                shippingFee={shippingFee}
                discountAmount={discountAmount}
                total={total}
                voucherCode={voucherCode}
                isCalculatingShipping={isCalculatingShipping}
                t={t}
              />
          </div>
        </div>
      </div>
    </div>
  )
}
