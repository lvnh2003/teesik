"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useAdminAuth } from "@/services/auth"
import { ProductService } from "@/services/products"
import { getImageUrl } from "@/services/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, X, Plus, Trash2, ImageIcon, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Category, Product, ProductVariant } from "@/type/product"
import { useProductAttributes } from "@/hooks/use-product-attributes"

function EditProductPageContent() {
  const { checkAuth } = useAdminAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const productId = searchParams.get("id") as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const [formData, setFormData] = useState<Product>()

  // Custom attribute management via hook
  const {
    attributes,
    setAttributes,
    variants,
    setVariants,
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
        // Tải danh mục
        const categoriesResponse = await ProductService.getCategories()
        setCategories(categoriesResponse.data)

        // Tải thông tin sản phẩm
        const productResponse = await ProductService.getProduct(productId)
        if (productResponse.data) {
          const product = productResponse.data

          // Cập nhật form data
          setFormData({
            id: product.id,
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            original_price: product.original_price || 0, // Fix key mapping
            category_id: product.category_id || 0,
            sku: product.sku || "",
            custom_id: product.custom_id || "",
            tags: Array.isArray(product.tags) ? product.tags : (product.tags ? String(product.tags).split(',').map((t: string) => t.trim()) : []),
            note: product.note || "",
            is_sell_negative: product.is_sell_negative ?? false,
            hide_config_product: product.hide_config_product ?? false,
            stock_quantity: product.stock_quantity || 0,
            images: product.images || []
          } as Product)


          // Cập nhật variants nếu có
          if (product.variations && product.variations.length > 0) {
            // Tạo danh sách thuộc tính từ variants
            const attributeMap = new Map<string, Set<string>>()

            product.variations.forEach((variant: ProductVariant) => {
              // Handle attributes as Record<string, string>
              if (variant.attributes && typeof variant.attributes === 'object' && !Array.isArray(variant.attributes)) {
                Object.entries(variant.attributes).forEach(([name, value]) => {
                  if (!attributeMap.has(name)) {
                    attributeMap.set(name, new Set())
                  }
                  attributeMap.get(name)?.add(String(value))
                })
              }
              // Fallback for potential legacy array format (just in case)
              else if (Array.isArray(variant.attributes)) {
                (variant.attributes as any[]).forEach((attrStr: unknown) => {
                  try {
                    const attr = typeof attrStr === 'string' ? JSON.parse(attrStr) : attrStr
                    if (typeof attr === 'object' && attr !== null && 'name' in attr && 'value' in attr) {
                      const typedAttr = attr as { name: string; value: string };
                      if (!attributeMap.has(typedAttr.name)) {
                        attributeMap.set(typedAttr.name, new Set())
                      }
                      attributeMap.get(typedAttr.name)?.add(typedAttr.value)
                    }
                  } catch (e) {
                    // ignore
                  }
                })
              }
            })

            // Chuyển đổi Map thành mảng attributes
            const attributesArray = Array.from(attributeMap).map(([name, values], index) => ({
              id: `attr-${index}`,
              name,
              values: Array.from(values),
            }))

            setAttributes(attributesArray)

            // Chuyển đổi variants
            const formattedVariants = product.variations.map(
              (variant: ProductVariant) => {
                // Tạo object attributes
                const variantAttributes: Record<string, string> = {}

                if (variant.attributes && typeof variant.attributes === 'object' && !Array.isArray(variant.attributes)) {
                  // If it's already a Record, use it (filtering out null/undefined if necessary)
                  Object.entries(variant.attributes).forEach(([k, v]) => {
                    if (v !== null && v !== undefined) {
                      variantAttributes[k] = String(v)
                    }
                  })
                } else if (Array.isArray(variant.attributes) && variant.attributes.length > 0) {
                  // Legacy array handling
                  (variant.attributes as any[]).forEach((attrStr) => {
                    try {
                      const attr = typeof attrStr === 'string' ? JSON.parse(attrStr) : attrStr
                      if (typeof attr === 'object' && attr !== null && 'name' in attr && 'value' in attr) {
                        const typedAttr = attr as { name: string; value: string };
                        variantAttributes[typedAttr.name] = typedAttr.value
                      }
                    } catch (e) {
                      // ignore
                    }
                  })
                }

                // Tìm hình ảnh của variant nếu có
                let variantImagePath = ""
                let variantImageId = undefined

                if (variant.images && variant.images.length > 0) {
                  variantImagePath = getImageUrl(`${variant.images[0].image_path}`)
                  variantImageId = variant.images[0].id
                }

                return {
                  id: variant.id,
                  product_id: variant.product_id,
                  attributes: variantAttributes,
                  sku: variant.sku || "",
                  price: variant.price || 0,
                  original_price: variant.original_price || 0,
                  stock_quantity: variant.stock_quantity || 0,
                  weight: variant.weight || 0,
                  images: variant.images || [],
                  image: null,
                  imagePreviewUrl: variantImagePath,
                  isDelete: false,
                }
              },
            )



            setVariants(formattedVariants as any)
          }
        }
      } catch (err: any) {
        const message = err instanceof Error ? err.message : "Failed to load product data"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: checked }
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })
  }

  // NOTE: Image handling for edit is slightly different due to existing images,
  // but variant image handling is now via hook.

  // Main Product Images Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...filesArray])
    }
  }

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Note: For existing images, we might need a way to mark them for deletion.
  // For now, valid display is a start. Deletion of existing main images 
  // might require separate API or specific logic not yet in PancakeService.
  // We will display them and allow adding new ones.

  // Sửa hàm handleSubmit để xử lý đúng hình ảnh biến thể

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      // Validate that all variants have SKUs
      if (variants.length > 0) {
        const missingSkus = variants.filter((v) => !v.sku.trim())
        if (missingSkus.length > 0) {
          setError("Vui lòng nhập SKU cho tất cả biến thể")
          setIsSaving(false)
          return
        }
      }

      const formDataToSend = new FormData()

      formDataToSend.append("_method", "PUT")
      // Basic product info
      if (formData) {
        formDataToSend.append("name", formData.name ?? "")
        formDataToSend.append("description", formData.description ?? "")
        formDataToSend.append("category_id", String(formData.category_id ?? ""))
        formDataToSend.append("custom_id", formData.custom_id ?? "")
        formDataToSend.append("note", formData.note ?? "")
        formDataToSend.append("is_sell_negative", formData.is_sell_negative ? "1" : "0")
        formDataToSend.append("hide_config_product", formData.hide_config_product ? "1" : "0")

        if (formData.tags) {
          const tagsString = typeof formData.tags === 'string' ? formData.tags : formData.tags.join(',');
          const tagsArray = tagsString.split(',').map((t: string) => t.trim()).filter(Boolean)
          tagsArray.forEach((t: string, i: number) => formDataToSend.append(`tags[${i}]`, t))
        }
      }

      // Product attributes (Global)
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
          // If variant has an ID that's not temporary (doesn't start with 'new-')
          if (variant.id && !String(variant.id).startsWith('new-')) {
            formDataToSend.append(`variations[${index}][id]`, variant.id.toString())
          }

          formDataToSend.append(`variations[${index}][sku]`, variant.sku)
          formDataToSend.append(`variations[${index}][price]`, String(variant.price))
          formDataToSend.append(`variations[${index}][original_price]`, String(variant.original_price) || "")
          formDataToSend.append(`variations[${index}][stock_quantity]`, String(variant.stock_quantity))
          formDataToSend.append(`variations[${index}][weight]`, String(variant.weight || 0))
          formDataToSend.append(`variations[${index}][isDelete]`, String(variant.isDelete))

          // Convert attributes object to array format
          let attrIndex = 0;
          Object.entries(variant.attributes).forEach(([key, value]) => {
            formDataToSend.append(`variations[${index}][attributes][${attrIndex}][name]`, key)
            formDataToSend.append(`variations[${index}][attributes][${attrIndex}][value]`, String(value))
            attrIndex++
          })

          // Variant image handling - Đảm bảo gửi đúng định dạng như khi tạo mới
          if (variant.image instanceof File) {
            // Nếu có hình ảnh mới được chọn, gửi file hình ảnh
            formDataToSend.append(`variations[${index}][image]`, variant.image)

            // Debug để kiểm tra
            console.log(`Adding image for variant ${index}:`, variant.image.name)
          }
        })
      }

      // Debug để kiểm tra FormData
      console.log("FormData entries:")
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1] instanceof File ? `File: ${(pair[1] as File).name}` : pair[1])
      }

      const response = await ProductService.updateProduct(productId, formDataToSend)

      if (response.data) {
        toast({
          title: "Cập nhật thành công",
          description: "Sản phẩm đã được cập nhật thành công",
        })
        router.push("/admin/products")
      } else {
        throw new Error("Failed to update product")
      }

    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to update product"
      setError(message)
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }



  // Note: For existing images, we might need a way to mark them for deletion.
  // For now, valid display is a start. Deletion of existing main images 
  // might require separate API or specific logic not yet in PancakeService.
  // We will display them and allow adding new ones.

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Đang tải thông tin sản phẩm...</p>
      </div>
    )
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
            <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
            <p className="text-muted-foreground">Cập nhật thông tin sản phẩm</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
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
                value={formData?.custom_id ?? ""}
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
                value={formData?.name ?? ""}
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
                value={formData?.category_id?.toString() ?? ""}
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
                value={Array.isArray(formData?.tags) ? formData.tags.join(', ') : (formData?.tags ?? "")}
                onChange={(e) => {
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return { ...prev, tags: e.target.value.split(',').map(t => t.trim()) };
                  });
                }}
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
              value={formData?.description ?? ""}
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
              value={formData?.note ?? ""}
              onChange={handleInputChange}
              className="mt-2"
              placeholder="Nhập ghi chú"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_sell_negative"
                checked={formData?.is_sell_negative ?? false}
                onCheckedChange={(checked) => handleCheckboxChange("is_sell_negative", checked as boolean)}
              />
              <Label htmlFor="is_sell_negative" className="font-medium text-blue-600">
                Cho phép bán tồn kho âm
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide_config_product"
                checked={formData?.hide_config_product ?? false}
                onCheckedChange={(checked) => handleCheckboxChange("hide_config_product", checked as boolean)}
              />
              <Label htmlFor="hide_config_product" className="font-medium">
                Không in sản phẩm khi in đơn
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh sản phẩm</CardTitle>
          <CardDescription>Quản lý hình ảnh sản phẩm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images (Display Only for now) */}
            {formData?.images?.map((image, index) => (
              <div key={`existing-${image.id}`} className="relative aspect-square rounded-md overflow-hidden border">
                <Image
                  src={getImageUrl(image.image_path)}
                  alt={image.alt_text || "Product Image"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Đã lưu
                </div>
              </div>
            ))}

            {/* New Images */}
            {selectedImages.map((image, index) => (
              <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden border group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New Product ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
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
                <Button type="button" onClick={() => generateVariants(String(formData?.price || ''), String(formData?.original_price || ''), String(formData?.stock_quantity || ''))} className="w-full mt-3">
                  Tạo tất cả biến thể
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Variants Management */}
      {variants.filter(v => v.isDelete !== true).length > 0 && (
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
                  {variants.filter(v => v.isDelete !== true).map((variant) => (
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
                          disabled
                          title="Giá nhập chỉ có thể thay đổi trên bộ đệm quản lý kho Pancake"
                          className="w-24 bg-muted text-muted-foreground cursor-not-allowed"
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
                                <Image
                                  src={variant.imagePreviewUrl || "/placeholder.svg"}
                                  alt={`Variant ${variant.id}`}
                                  width={48}
                                  height={48}
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
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </div>
  )
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    }>
      <EditProductPageContent />
    </Suspense>
  )
}
