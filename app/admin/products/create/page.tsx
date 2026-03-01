"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { createProduct, getCategories } from "@/lib/admin-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Upload, X, Plus, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAuthToken } from "@/lib/auth"
import { Category } from "@/type/product"
import { useProductAttributes } from "@/hooks/use-product-attributes"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
export default function CreateProductPage() {
  const { checkAuth } = useAdminAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    stock_quantity: "0",
    sku: "",
    custom_id: "",
    tags: "",
    note: "",
    is_sell_negative: false,
    hide_config_product: false,
  })

  // Use custom hook for attributes and variants
  const {
    attributes,
    variants,
    newAttributeName,
    setNewAttributeName,
    newAttributeValues,
    setNewAttributeValues,
    error: attributesError,
    addAttributeCategory,
    removeAttributeCategory,
    addAttributeValue,
    removeAttributeValue,
    generateVariants,
    updateVariant,
    removeVariant,
    handleVariantImageChange,
    removeVariantImage,
    calculateTotalVariants
  } = useProductAttributes()

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      try {
        const response = await getCategories()
        setCategories(response.data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load categories"
        setError(message)
      }
    }

    init()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Main Product Images Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (attributesError) {
        setError(attributesError)
        setIsLoading(false)
        return
      }

      // Validate that all variants have SKUs
      if (variants.length > 0) {
        const missingSkus = variants.filter((v) => !v.sku.trim())
        if (missingSkus.length > 0) {
          setError("Vui lòng nhập SKU cho tất cả biến thể")
          setIsLoading(false)
          return
        }
      }

      const formDataToSend = new FormData()

      // Basic product info
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category_id', formData.category_id)
      formDataToSend.append('sku', formData.sku)
      formDataToSend.append('custom_id', formData.custom_id)
      formDataToSend.append('note', formData.note)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('original_price', formData.original_price)
      formDataToSend.append('stock_quantity', formData.stock_quantity)
      formDataToSend.append('is_sell_negative', formData.is_sell_negative.toString())
      formDataToSend.append('hide_config_product', formData.hide_config_product.toString())

      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        tagsArray.forEach((t, i) => formDataToSend.append(`tags[${i}]`, t))
      }

      // General images
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image)
      })

      // Product attributes
      if (attributes.length > 0) {
        attributes.forEach((attr, index) => {
          formDataToSend.append(`product_attributes[${index}][name]`, attr.name)
          attr.values.forEach((val, valIndex) => {
            formDataToSend.append(`product_attributes[${index}][values][${valIndex}]`, val)
          })
        })
      }

      if (variants.length > 0) {
        // Product with variants
        variants.forEach((variant, index) => {
          formDataToSend.append(`variations[${index}][sku]`, variant.sku)
          formDataToSend.append(`variations[${index}][price]`, String(variant.price))
          formDataToSend.append(`variations[${index}][original_price]`, String(variant.original_price || 0))
          formDataToSend.append(`variations[${index}][stock_quantity]`, String(variant.stock_quantity || 0))
          formDataToSend.append(`variations[${index}][weight]`, String(variant.weight || 0))

          // Convert attributes object to array format
          let attrIndex = 0;
          Object.entries(variant.attributes).forEach(([key, value]) => {
            formDataToSend.append(`variations[${index}][attributes][${attrIndex}][name]`, key)
            formDataToSend.append(`variations[${index}][attributes][${attrIndex}][value]`, String(value))
            attrIndex++
          })

          // Variant image
          if (variant.image instanceof File) {
            formDataToSend.append(`variations[${index}][image]`, variant.image, variant.image.name)
          }
        })
      }

      const token = getAuthToken()
      if (!token) throw new Error("Authentication required")

      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: formDataToSend,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }

      router.push("/admin/products")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create product"
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Thêm sản phẩm mới</h1>
            <p className="text-muted-foreground">Tạo sản phẩm mới cho cửa hàng</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 border border-destructive/30 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Basic Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="custom_id" className="text-base">
                Mã sản phẩm (Bên trong Pancake)
              </Label>
              <Input
                id="custom_id"
                name="custom_id"
                value={formData.custom_id}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="VD: QUANAO-001"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-base">
                Tên sản phẩm *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-2"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div>
              <Label htmlFor="category_id" className="text-base">
                Danh mục *
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleSelectChange("category_id", value)}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags" className="text-base">
                Thẻ (Tags)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="Cách nhau bằng dấu phẩy (VD: the1, the2)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-base">
              Mô tả sản phẩm *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-2 min-h-[150px]"
              placeholder="Mô tả chi tiết về sản phẩm"
            />
          </div>

          <div>
            <Label htmlFor="note" className="text-base">
              Ghi chú nội bộ
            </Label>
            <Input
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="mt-2"
              placeholder="Nhập ghi chú"
            />
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_sell_negative"
                checked={formData.is_sell_negative}
                onCheckedChange={(checked) => handleCheckboxChange("is_sell_negative", checked as boolean)}
              />
              <Label htmlFor="is_sell_negative" className="font-medium text-blue-600">
                Cho phép bán tồn kho âm
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide_config_product"
                checked={formData.hide_config_product}
                onCheckedChange={(checked) => handleCheckboxChange("hide_config_product", checked as boolean)}
              />
              <Label htmlFor="hide_config_product" className="font-medium">
                Không in sản phẩm khi in đơn
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bán hàng</CardTitle>
          <CardDescription>Thiết lập giá và quản lý kho</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sku" className="text-base">
                Mã sản phẩm (SKU / Mã vạch)
              </Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="VD: SP001"
              />
            </div>
            <div>
              <Label htmlFor="stock_quantity" className="text-base">
                Tồn kho / Có thể bán
              </Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-base">
                Giá bán
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="original_price" className="text-base">
                Giá nhập
              </Label>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                value={formData.original_price}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
          <CardDescription>Đăng tải hình ảnh cho sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Product ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-destructive/90 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Tải ảnh lên</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Product Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Phân loại sản phẩm</CardTitle>
          <CardDescription>Tạo các phân loại để có nhiều biến thể sản phẩm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new attribute category */}
          <div className="flex gap-2">
            <Input
              placeholder="Tên phân loại (VD: Màu sắc, Kích thước...)"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addAttributeCategory()
                }
              }}
            />
            <Button type="button" onClick={addAttributeCategory} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </Button>
          </div>

          {/* Attribute categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                <p>Chưa có phân loại nào</p>
                <p className="text-sm mt-1">Thêm phân loại để tạo biến thể sản phẩm</p>
              </div>
            )}

            {attributes.map((attribute) => (
              <Card key={attribute.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{attribute.name}</h3>
                      <Badge variant="secondary">{attribute.values.length}</Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttributeCategory(attribute.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Giá trị cho ${attribute.name}`}
                      value={newAttributeValues[attribute.id] || ""}
                      onChange={(e) =>
                        setNewAttributeValues((prev) => ({
                          ...prev,
                          [attribute.id]: e.target.value,
                        }))
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addAttributeValue(attribute.id)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addAttributeValue(attribute.id)}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attribute.values.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">Chưa có giá trị nào</p>
                    )}

                    {attribute.values.map((value) => (
                      <Badge key={value} variant="outline" className="flex items-center gap-1 py-1.5 px-3">
                        {value}
                        <button
                          type="button"
                          onClick={() => removeAttributeValue(attribute.id, value)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {calculateTotalVariants() > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <p className="font-medium">
                  Tổng số biến thể: <span className="text-primary">{calculateTotalVariants()}</span>
                </p>
                <Button type="button" onClick={() => generateVariants(formData.price, formData.original_price, formData.stock_quantity)} className="w-full mt-3">
                  Tạo tất cả biến thể
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Variants Management */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quản lý biến thể sản phẩm</CardTitle>
            <CardDescription>Quản lý SKU, giá, tồn kho và hình ảnh cho từng biến thể</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Thuộc tính</th>
                    <th className="text-left p-3 font-medium">Mã vạch *</th>
                    <th className="text-left p-3 font-medium">Giá bán</th>
                    <th className="text-left p-3 font-medium">Giá nhập</th>
                    <th className="text-left p-3 font-medium">Trọng lượng (g)</th>
                    <th className="text-left p-3 font-medium">Có thể bán</th>
                    <th className="text-left p-3 font-medium">Hình ảnh</th>
                    <th className="text-left p-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                          placeholder="Nhập SKU"
                          className="w-32"
                          required
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={variant.original_price}
                          onChange={(e) => updateVariant(variant.id, "original_price", e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={variant.weight || ""}
                          onChange={(e) => updateVariant(variant.id, "weight", e.target.value)}
                          className="w-20"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) => updateVariant(variant.id, "stock_quantity", e.target.value)}
                          className="w-20"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {variant.imagePreviewUrl ? (
                            <div className="relative group">
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                                <img
                                  src={variant.imagePreviewUrl || "/placeholder.svg"}
                                  alt={`Variant ${variant.id}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVariantImage(variant.id)}
                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <Input
                              id={`variant-image-${variant.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVariantImageChange(e, variant.id)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`variant-image-${variant.id}`)?.click()}
                            >
                              {variant.imagePreviewUrl ? "Thay đổi" : "Chọn ảnh"}
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons (Bottom) */}
      <div className="flex justify-end gap-4 pt-4">
        <Link href="/admin/products">
          <Button type="button" variant="outline">
            Hủy
          </Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
      </div>
    </div>
  )
}
