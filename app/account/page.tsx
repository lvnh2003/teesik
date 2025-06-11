"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AccountPage() {
  const { login, register, isLoading, isLoggedIn, user } = useAuth()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })

  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn && user) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, user, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await login(loginData.email, loginData.password)
      setSuccess("Đăng nhập thành công!")
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Đăng nhập thất bại")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (registerData.password !== registerData.password_confirmation) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      await register(registerData)
      setSuccess("Đăng ký thành công!")
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Đăng ký thất bại")
    }
  }

  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Chào mừng, {user.name}!</h1>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 border-b border-gray-200 bg-white">
        <div className="container px-4 mx-auto text-center">
          <Badge className="mb-6 bg-black text-white hover:bg-gray-800 text-xs tracking-wider">ACCOUNT</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black uppercase">Welcome Back</h1>
          <p className="text-xl text-gray-600">Sign in to your account or create a new one</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="max-w-md mx-auto">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-sm font-medium tracking-wider uppercase">
                Đăng Nhập
              </TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium tracking-wider uppercase">
                Đăng Ký
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <div className="bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-black tracking-tighter mb-6 text-black uppercase text-center">
                  Đăng Nhập
                </h2>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-black"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Mật Khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-black"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" disabled={isLoading} />
                      <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="text-sm text-black hover:text-gray-600 font-medium">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg font-medium tracking-wider uppercase"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <div className="bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-black tracking-tighter mb-6 text-black uppercase text-center">Đăng Ký</h2>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium tracking-wider uppercase mb-2">Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Nguyen Van A"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="pl-12 h-12 border-2 border-gray-200 focus:border-black"
                          required
                          disabled={isLoading}
                        />
                      </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-black"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Số Điện Thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="tel"
                        placeholder="0123 456 789"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-black"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Mật Khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-black"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-wider uppercase mb-2">Xác Nhận Mật Khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password_confirmation}
                        onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                        className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-black"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" className="mr-3 mt-1" required disabled={isLoading} />
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với{" "}
                      <a href="#" className="text-black font-medium hover:text-gray-600">
                        Điều khoản dịch vụ
                      </a>{" "}
                      và{" "}
                      <a href="#" className="text-black font-medium hover:text-gray-600">
                        Chính sách bảo mật
                      </a>
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg font-medium tracking-wider uppercase"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
