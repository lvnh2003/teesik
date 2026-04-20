"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Edit, Trash2, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { AddressService, UserAddress } from "@/services/address"
import { ShippingService, Province, District, Ward } from "@/services/shipping"

export default function AddressesPage() {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    receiver_name: "",
    phone: "",
    specific_address: "",
    province_id: 0,
    province: "",
    district_id: 0,
    district: "",
    ward_code: "",
    ward: "",
    is_default: false
  })

  // Shipping selection states
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/account")
    } else if (isLoggedIn) {
      fetchAddresses()
      fetchProvinces()
    }
  }, [isLoggedIn, isLoading, router])

  const fetchAddresses = async () => {
    try {
      const res = await AddressService.getAddresses()
      if (res.success) {
        setAddresses(res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinces = async () => {
    try {
      const res = await ShippingService.getProvinces()
      if (res.success) setProvinces(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = parseInt(e.target.value)
    const provName = e.target.options[e.target.selectedIndex].text
    
    setFormData(prev => ({
      ...prev,
      province_id: provId,
      province: provName,
      district_id: 0,
      district: "",
      ward_code: "",
      ward: ""
    }))
    
    setDistricts([])
    setWards([])

    if (provId) {
      try {
        const res = await ShippingService.getDistricts(provId)
        if (res.success) setDistricts(res.data)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = parseInt(e.target.value)
    const distName = e.target.options[e.target.selectedIndex].text
    
    setFormData(prev => ({
      ...prev,
      district_id: distId,
      district: distName,
      ward_code: "",
      ward: ""
    }))
    
    setWards([])

    if (distId) {
      try {
        const res = await ShippingService.getWards(distId)
        if (res.success) setWards(res.data)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wCode = e.target.value
    const wName = e.target.options[e.target.selectedIndex].text
    
    setFormData(prev => ({
      ...prev,
      ward_code: wCode,
      ward: wName
    }))
  }

  const handleEdit = async (addr: UserAddress) => {
    setShowForm(true)
    setEditingId(addr.id)
    setFormData({
      receiver_name: addr.receiver_name,
      phone: addr.phone,
      specific_address: addr.specific_address,
      province_id: addr.province_id,
      province: addr.province,
      district_id: addr.district_id,
      district: addr.district,
      ward_code: addr.ward_code,
      ward: addr.ward,
      is_default: addr.is_default
    })

    // Load districts and wards for the selected province
    if (addr.province_id) {
      const resDist = await ShippingService.getDistricts(addr.province_id)
      if (resDist.success) setDistricts(resDist.data)
    }
    if (addr.district_id) {
      const resWard = await ShippingService.getWards(addr.district_id)
      if (resWard.success) setWards(resWard.data)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return
    
    try {
      const res = await AddressService.deleteAddress(id)
      if (res.success) {
        toast.success("Xóa địa chỉ thành công")
        fetchAddresses()
      }
    } catch (e) {
      toast.error("Lỗi xóa địa chỉ")
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const res = await AddressService.setDefault(id)
      if (res.success) {
        toast.success("Đã thay đổi địa chỉ mặc định")
        fetchAddresses()
      }
    } catch (e) {
      toast.error("Lỗi thao tác")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.province_id || !formData.district_id || !formData.ward_code) {
      toast.error("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã")
      return
    }

    try {
      if (editingId) {
        await AddressService.updateAddress(editingId, formData)
        toast.success("Cập nhật địa chỉ thành công")
      } else {
        await AddressService.createAddress(formData)
        toast.success("Thêm địa chỉ thành công")
      }
      setShowForm(false)
      setEditingId(null)
      fetchAddresses()
      
      // Reset form
      setFormData({
        receiver_name: "", phone: "", specific_address: "",
        province_id: 0, province: "", district_id: 0, district: "",
        ward_code: "", ward: "", is_default: false
      })
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra")
    }
  }

  if (isLoading || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-20 text-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Trở về Dashboard
        </Link>
        
        <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Sổ Địa Chỉ</h1>
          {!showForm && (
            <Button onClick={() => { setShowForm(true); setEditingId(null); }} className="bg-black text-white hover:bg-neutral-800 rounded-none uppercase font-bold tracking-widest text-xs h-10 px-6">
              <Plus className="w-4 h-4 mr-2" /> Thêm Mới
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white p-8 border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <h2 className="text-xl font-bold uppercase mb-6 tracking-wide">
              {editingId ? "Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest">Họ & Tên Người Nhận</Label>
                  <Input 
                    value={formData.receiver_name} 
                    onChange={e => setFormData({...formData, receiver_name: e.target.value})} 
                    className="rounded-none border-black focus-visible:ring-0" required
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest">Số Điện Thoại</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="rounded-none border-black focus-visible:ring-0" required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest">Tỉnh / Thành Phố</Label>
                  <select 
                    value={formData.province_id} 
                    onChange={handleProvinceChange}
                    className="w-full h-10 border border-black bg-transparent px-3 py-2 text-sm focus:outline-none"
                    required
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map(p => (
                      <option key={p.province_id} value={p.province_id}>{p.province_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest">Quận / Huyện</Label>
                  <select 
                    value={formData.district_id} 
                    onChange={handleDistrictChange}
                    className="w-full h-10 border border-black bg-transparent px-3 py-2 text-sm focus:outline-none"
                    required
                    disabled={!formData.province_id}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(d => (
                      <option key={d.district_id} value={d.district_id}>{d.district_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest">Phường / Xã</Label>
                  <select 
                    value={formData.ward_code} 
                    onChange={handleWardChange}
                    className="w-full h-10 border border-black bg-transparent px-3 py-2 text-sm focus:outline-none"
                    required
                    disabled={!formData.district_id}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(w => (
                      <option key={w.ward_code} value={w.ward_code}>{w.ward_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-widest">Địa chỉ cụ thể</Label>
                <Input 
                  value={formData.specific_address} 
                  onChange={e => setFormData({...formData, specific_address: e.target.value})} 
                  placeholder="Số nhà, Tên đường..."
                  className="rounded-none border-black focus-visible:ring-0" required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_default"
                  checked={formData.is_default}
                  onChange={e => setFormData({...formData, is_default: e.target.checked})}
                  className="rounded-none border-black"
                />
                <Label htmlFor="is_default" className="text-sm cursor-pointer">Đặt làm địa chỉ mặc định</Label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-black/10">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-none border-black text-black">
                  Hủy Bỏ
                </Button>
                <Button type="submit" className="rounded-none bg-black text-white hover:bg-neutral-800">
                  Lưu Thông Tin
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid gap-6">
            {addresses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300">
                <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Bạn chưa thiết lập địa chỉ nào.</p>
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className={`p-6 border ${addr.is_default ? 'border-2 border-black bg-gray-50' : 'border border-gray-300'} flex flex-col md:flex-row justify-between md:items-center relative`}>
                  
                  {addr.is_default && (
                    <Badge className="absolute -top-3 -left-3 rounded-none bg-black text-white font-mono uppercase tracking-widest text-[10px]">
                      Mặc định
                    </Badge>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold uppercase tracking-wide text-lg">{addr.receiver_name}</h3>
                      <span className="text-gray-400">|</span>
                      <span className="font-mono">{addr.phone}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{addr.specific_address}</p>
                    <p className="text-sm text-gray-600">{addr.ward}, {addr.district}, {addr.province}</p>
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex gap-4 md:flex-col lg:flex-row items-center border-t border-gray-200 md:border-t-0 pt-4 md:pt-0">
                    {!addr.is_default && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                        Đặt mặc định
                      </button>
                    )}
                    <button onClick={() => handleEdit(addr)} className="text-gray-500 hover:text-black transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
