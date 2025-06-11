// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { useAdminAuth } from "@/lib/admin-auth"
// import { getProduct, updateProduct, getCategories, type Product, type Category } from "@/lib/admin-api"
// import { Button } from "@/components/ui/button"
// import { AlertCircle, ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default function EditProductPage({ params }: { params: { id: string } }) {
//   const { checkAuth } = useAdminAuth()
//   const router = useRouter()
//   const productId = Number.parseInt(params.id)
  
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [error, setError] = useState("")
//   const [categories, setCategories] = useState<Category[]>([])
//   const [product, setProduct] = useState<Product | null>(null)
//   const [selectedImages, setSelectedImages] = useState<File[]>([])
//   const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     original_price: "",
//     category_id: "",
//     is_new: false,
//     is_featured: false,
//     stock_quantity: "0",
//     sku: "",
//   })

//   useEffect(() => {
//     const init = async () => {
//       await checkAuth()
//       try {
//         // Fetch product and categories in parallel
//         const [productResponse, categoriesResponse] = await Promise.all([
//           getProduct(productId),
//           getCategories()
//         ])
        
//         const productData = productResponse.data
//         setProduct(productData)
//         setCategories(categoriesResponse.data)
        
//         // Set form data from product
//         setFormData({
//           name: productData.name,
//           description: productData.description,
//           price: productData.price.toString(),
//           original_price: productData.original_price?.toString() || "",
//           category_id: productData.category_id.toString(),
//           is_new: productData.is_new || false,
//           is_featured: productData.is_featured || false,
//           stock_quantity: productData.stock_quantity.toString(),
//           sku: productData.sku,
//         })
//       } catch (err: any) {
//         setError(err.message || "Failed to load product data")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     init()
//   }, [checkAuth, productId])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }))
//   }

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files)
//       setSelectedImages((prev) => [...prev, ...filesArray])

//       // Create preview URLs
//       const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
//       setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
//     }
//   }

//   const removeImage = (index: number) => {
//     // Revoke the object URL to avoid memory leaks
//     URL.revokeObjectURL(imagePreviewUrls[index])

//     setSelectedImages((prev) => prev.filter((_, i) => i !== index))
//     setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSaving(true)
//     setError("")

//     try {
//       // Convert string values to appropriate types
//       const productData = {
//         name: formData.name,
//         description: formData.description,
//         price: Number.parseFloat(formData.price),
//         original_price: formData.original_price ? Number.parseFloat(formData.original_price) : undefined,
//         category_id: Number.parseInt(formData.category_id),
//         is_new: formData.is_new,
//         is_featured: formData.is_featured,
//         stock_quantity: Number.parseInt(formData.stock_quantity),
//         sku: formData.sku,
//         images: selectedImages.length > 0 ? selectedImages : undefined,
//       }

//       await updateProduct(productId, productData)
//       router.push("/admin/products")
//     } catch (err: any) {
//       setError(err.message || "Failed to update product")
//       setIsSaving(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     )
//   }

//   if (!product) {
//     return (
//       <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
//         <p className="text-red-700">Không tìm thấy sản phẩm</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <Link href="/admin/products" className="mr-4">
//             <Button variant="ghost" size="sm">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Quay lại
//             </Button>
//           </Link>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa sản phẩm</h1>
//             <p className="text-gray-500">Cập nhật thông tin sản phẩm</p>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
//           <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//           <p className="text-red-700">{error}</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {
