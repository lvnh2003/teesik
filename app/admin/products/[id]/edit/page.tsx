"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { getProductById, updateProduct, getCategories, type Category, type ProductImage } from "@/lib/admin-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, X, Plus, Trash2, ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function EditProductPage() {
  const { checkAuth } = useAdminAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    is_new: false,
    is_featured: false,
    stock_quantity: "0",
    sku: "",
  })

  // Custom attribute management
  const [attributes, setAttributes] = useState<{ id: string; name: string; values: string[] }[]>([])
  const [newAttributeName, setNewAttributeName] = useState("")
  const [newAttributeValues, setNewAttributeValues] = useState<Record<string, string>>({})

  // Variants management
  const [variants, setVariants] = useState<
    {
      id: string | number
      product_id: number
      sku: string
      price: string
      original_price: string
      stock_quantity: string
      is_active: number
      attributes: Record<string, string>
      created_at: string
      updated_at: string
      images: ProductImage[]
      image: File | null
      imagePreviewUrl: string
    }[]
  >([])

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      try {
        // Tải danh mục
        const categoriesResponse = await getCategories()
        setCategories(categoriesResponse.data)

        // Tải thông tin sản phẩm
        const productResponse = await getProductById(Number(productId))
        if (productResponse.data) {
          const product = productResponse.data

          // Cập nhật form data
          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            original_price: product.original_price?.toString() || "",
            category_id: product.category_id?.toString() || "",
            is_new: product.is_new || false,
            is_featured: product.is_featured || false,
            stock_quantity: "0", // Sử dụng từ variants
            sku: "", // Sử dụng từ variants
          })

          // // Cập nhật hình ảnh hiện có
          // if (product.images && product.images.length > 0) {
          //   setExistingImages(product.images)
          // }

          // Cập nhật variants nếu có
          if (product.variants && product.variants.length > 0) {
            // Tạo danh sách thuộc tính từ variants
            const attributeMap = new Map<string, Set<string>>()

            product.variants.forEach((variant: { attributes: string[] }) => {
              if (variant.attributes && variant.attributes.length > 0) {
                variant.attributes.forEach((attrStr: string) => {
                  try {
                    const attr = JSON.parse(attrStr)
                    if (attr && attr.name && attr.value) {
                      if (!attributeMap.has(attr.name)) {
                        attributeMap.set(attr.name, new Set())
                      }
                      attributeMap.get(attr.name)?.add(attr.value)
                    }
                  } catch (e) {
                    console.error("Invalid attribute JSON:", attrStr)
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
            const formattedVariants = product.variants.map(
              (variant: {
                attributes: string[]
                images: string | any[]
                id: any
                product_id: any
                sku: any
                price: { toString: () => any }
                original_price: { toString: () => any }
                stock_quantity: { toString: () => any }
                is_active: any
                created_at: any
                updated_at: any
              }) => {
                // Tạo object attributes từ mảng
                const variantAttributes: Record<string, string> = {}
                if (variant.attributes && variant.attributes.length > 0) {
                  variant.attributes.forEach((attrStr: string) => {
                    try {
                      const attr = JSON.parse(attrStr)
                      if (attr && attr.name && attr.value) {
                        variantAttributes[attr.name] = attr.value
                      }
                    } catch (e) {
                      console.error("Invalid attribute JSON:", attrStr)
                    }
                  })
                }

                // Tìm hình ảnh của variant nếu có
                let variantImagePath = ""
                let variantImageId = undefined

                if (variant.images && variant.images.length > 0) {
                  variantImagePath = `http://localhost:8000/storage/${variant.images[0].image_path}`
                  variantImageId = variant.images[0].id
                }

                return {
                  id: variant.id,
                  product_id: variant.product_id,
                  attributes: variantAttributes,
                  sku: variant.sku || "",
                  price: variant.price?.toString() || "",
                  original_price: variant.original_price?.toString() || "",
                  stock_quantity: variant.stock_quantity?.toString() || "0",
                  is_active: variant.is_active,
                  created_at: variant.created_at,
                  updated_at: variant.updated_at,
                  images: variant.images || [],
                  image: null,
                  imagePreviewUrl: variantImagePath,
                }
              },
            )

            setVariants(formattedVariants)
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product data")
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [productId])

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

  const handleVariantImageChange = (e: React.ChangeEvent<HTMLInputElement>, variantId: number | string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const previewUrl = URL.createObjectURL(file)

      setVariants((prev) =>
        prev.map((variant) => {
          if (variant.id === variantId) {
            // Nếu là URL từ browser, cần revoke để tránh memory leak
            if (variant.imagePreviewUrl && !variant.imagePreviewUrl.includes("http://localhost:8000/storage/")) {
              URL.revokeObjectURL(variant.imagePreviewUrl)
            }
            return {
              ...variant,
              image: file,
              imagePreviewUrl: previewUrl,
            }
          }
          return variant
        }),
      )
    }
  }

  const removeVariantImage = (variantId: number | string) => {
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.id === variantId) {
          // Nếu là URL từ browser, cần revoke để tránh memory leak
          if (variant.imagePreviewUrl && !variant.imagePreviewUrl.includes("http://localhost:8000/storage/")) {
            URL.revokeObjectURL(variant.imagePreviewUrl)
          }
          return {
            ...variant,
            image: null,
            imagePreviewUrl: "",
          }
        }
        return variant
      }),
    )
  }

  // Add new attribute category
  const addAttributeCategory = () => {
    if (!newAttributeName.trim()) return

    const attributeId = `attr-${Date.now()}`
    setAttributes((prev) => [...prev, { id: attributeId, name: newAttributeName.trim(), values: [] }])
    setNewAttributeName("")
    setNewAttributeValues((prev) => ({ ...prev, [attributeId]: "" }))
  }

  // Remove attribute category
  const removeAttributeCategory = (attributeId: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== attributeId))

    if (variants.length > 0) {
      const attrName = attributes.find((a) => a.id === attributeId)?.name
      if (attrName) {
        setVariants((prev) =>
          prev.map((variant) => {
            const newAttributes = { ...variant.attributes }
            delete newAttributes[attrName]
            return { ...variant, attributes: newAttributes }
          }),
        )
      }
    }
  }

  // Add attribute value
  const addAttributeValue = (attributeId: string) => {
    const value = newAttributeValues[attributeId]?.trim()
    if (!value) return

    setAttributes((prev) =>
      prev.map((attr) => (attr.id === attributeId ? { ...attr, values: [...attr.values, value] } : attr)),
    )

    setNewAttributeValues((prev) => ({ ...prev, [attributeId]: "" }))
  }

  // Remove attribute value
  const removeAttributeValue = (attributeId: string, valueToRemove: string) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId ? { ...attr, values: attr.values.filter((v) => v !== valueToRemove) } : attr,
      ),
    )
  }

  // Generate all possible variants from attributes
  const generateVariants = () => {
    const activeAttributes = attributes.filter((attr) => attr.values.length > 0)
    if (activeAttributes.length === 0) {
      setError("Vui lòng thêm ít nhất một phân loại và giá trị")
      return
    }

    const combinations: Record<string, string>[] = []

    const generateCombinations = (index: number, current: Record<string, string>) => {
      if (index === activeAttributes.length) {
        combinations.push({ ...current })
        return
      }

      const attr = activeAttributes[index]
      for (const value of attr.values) {
        current[attr.name] = value
        generateCombinations(index + 1, current)
      }
    }

    generateCombinations(0, {})

    // Kiểm tra xem variant đã tồn tại chưa
    const existingVariantMap = new Map<string, (typeof variants)[0]>()

    variants.forEach((variant) => {
      const key = JSON.stringify(variant.attributes)
      existingVariantMap.set(key, variant)
    })

    // Tạo mảng variants mới, giữ lại các variant đã tồn tại
    const newVariants = combinations.map((combo) => {
      const key = JSON.stringify(combo)
      if (existingVariantMap.has(key)) {
        return existingVariantMap.get(key)!
      }

      return {
        id: Number,
        product_id: Number.parseInt(productId),
        attributes: combo,
        sku: "",
        price: formData.price,
        original_price: formData.original_price,
        stock_quantity: "0",
        is_active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [],
        image: null,
        imagePreviewUrl: "",
      }
    })

    // Ensure all newVariants are of the correct type
    setVariants(newVariants as typeof variants)
    setError("")
  }
  const updateVariant = (variantId: number | string, field: string, value: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === variantId ? { ...variant, [field]: value } : variant)))
  }

  // Remove variant
  const removeVariant = (variantId: number | string) => {
    // Clean up image preview URL
    const variant = variants.find((v) => v.id === variantId)
    if (variant && variant.imagePreviewUrl) {
      URL.revokeObjectURL(variant.imagePreviewUrl)
    }

    setVariants((prev) => prev.filter((variant) => variant.id !== variantId))
  }

  // Calculate total number of variants
  const calculateTotalVariants = () => {
    return attributes.filter((attr) => attr.values.length > 0).reduce((acc, attr) => acc * attr.values.length, 1)
  }

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
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category_id", formData.category_id)
      formDataToSend.append("is_new", formData.is_new ? "1" : "0")
      formDataToSend.append("is_featured", formData.is_featured ? "1" : "0")
      formDataToSend.append("sku", formData.sku)

      // New images
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image)
      })

      if (variants.length > 0) {
        // Product with variants
        variants.forEach((variant, index) => {
          // If variant has an ID that's a number, it's an existing variant
          if (typeof variant.id === "number") {
            formDataToSend.append(`variants[${index}][id]`, variant.id.toString())
          }

          formDataToSend.append(`variants[${index}][sku]`, variant.sku)
          formDataToSend.append(`variants[${index}][price]`, variant.price)
          formDataToSend.append(`variants[${index}][original_price]`, variant.original_price || "")
          formDataToSend.append(`variants[${index}][stock_quantity]`, variant.stock_quantity)

          // Convert attributes object to array format
          Object.entries(variant.attributes).forEach(([key, value]) => {
            formDataToSend.append(`variants[${index}][attributes][]`, JSON.stringify({ name: key, value: value }))
          })

          // Variant image handling - Đảm bảo gửi đúng định dạng như khi tạo mới
          if (variant.image instanceof File) {
            // Nếu có hình ảnh mới được chọn, gửi file hình ảnh
            formDataToSend.append(`variants[${index}][image]`, variant.image)

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

      const response = await updateProduct(Number(productId), formDataToSend)

      if (response.success) {
        toast({
          title: "Cập nhật thành công",
          description: "Sản phẩm đã được cập nhật thành công",
        })
        router.push("/admin/products")
      } else {
        throw new Error(response.message || "Failed to update product")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update product")
      toast({
        title: "Lỗi",
        description: err.message || "Không thể cập nhật sản phẩm",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Sửa hàm handleVariantImageChange để xử lý đúng hình ảnh biến thể

  // Sửa hàm removeVariantImage để xử lý đúng việc xóa hình ảnh biến thể

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price" className="text-base font-medium">
                Giá bán *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="mt-2"
                placeholder="VD: 100000"
              />
            </div>

            <div>
              <Label htmlFor="original_price" className="text-base font-medium">
                Giá gốc
              </Label>
              <Input
                id="original_price"
                name="original_price"
                type="number"
                value={formData.original_price}
                onChange={handleInputChange}
                className="mt-2"
                placeholder="VD: 150000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_new"
                checked={formData.is_new}
                onCheckedChange={(checked) => handleCheckboxChange("is_new", checked as boolean)}
              />
              <Label htmlFor="is_new" className="font-medium">
                Sản phẩm mới
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
              />
              <Label htmlFor="is_featured" className="font-medium">
                Sản phẩm nổi bật
              </Label>
            </div>
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
                <Button type="button" onClick={generateVariants} className="w-full mt-3">
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
                    <th className="text-left p-3 font-medium">Biến thể</th>
                    <th className="text-left p-3 font-medium">SKU *</th>
                    <th className="text-left p-3 font-medium">Giá bán</th>
                    <th className="text-left p-3 font-medium">Giá gốc</th>
                    <th className="text-left p-3 font-medium">Tồn kho</th>
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
