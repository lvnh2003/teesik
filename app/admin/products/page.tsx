"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminAuth } from "@/lib/admin-auth"
import { getProducts, deleteProduct, getProduct, getImageUrl } from "@/lib/admin-api"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Minus,
  PlusCircle,
  Search,
  Edit,
  AlertCircle,
  Package,
  Eye,
  ArrowUpDown,
  Layers,
  Tag,
  Copy,
  MoreHorizontal,
  Loader2,
  CopyIcon,
  Star,
} from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ProductPreviewModal } from "@/components/product-preview-modal"
import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/type/product"

export default function ProductsPage() {
  const { checkAuth } = useAdminAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | number | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Trạng thái cho modal xem trước sản phẩm
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loadingProductId, setLoadingProductId] = useState<string | number | null>(null)
  const [duplicatingProductId, setDuplicatingProductId] = useState<string | number | null>(null)
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string | number>>(new Set())

  const toggleProductExpand = (productId: string | number) => {
    const newExpanded = new Set(expandedProductIds)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProductIds(newExpanded)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      await checkAuth()
      try {
        const response = await getProducts({ page: currentPage })
        if (response.data) {
          setProducts(response.data)
        }

        if (response.meta && response.meta.total && response.meta.per_page) {
          setTotalPages(Math.ceil(response.meta.total / response.meta.per_page))
        } else {
          setTotalPages(1)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage])

  const handleDeleteClick = (productId: string | number) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete)
        setProducts(products.filter((product) => product.id !== productToDelete))
        toast({
          title: "Xóa thành công",
          description: "Sản phẩm đã được xóa khỏi hệ thống",
        })
      } catch (err: any) {
        setError(err.message || "Failed to delete product")
        toast({
          title: "Lỗi",
          description: err.message || "Không thể xóa sản phẩm",
          variant: "destructive",
        })
      } finally {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
      }
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Xử lý xem trước sản phẩm
  const handlePreviewProduct = async (productId: string | number) => {
    setLoadingProductId(productId)
    try {
      const response = await getProduct(productId)
      if (response.data) {
        setSelectedProduct(response.data)
        setPreviewModalOpen(true)
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message || "Không thể tải thông tin sản phẩm",
        variant: "destructive",
      })
    } finally {
      setLoadingProductId(null)
    }
  }

  // Xử lý nhân bản sản phẩm
  // const handleDuplicateProduct = async (productId: number) => {
  //   setDuplicatingProductId(productId)
  //   try {
  //     const response = await duplicateProduct(productId)
  //     if (response.success && response.data) {
  //       // Thêm sản phẩm mới vào danh sách
  //       setProducts([response.data, ...products])
  //       toast({
  //         title: "Nhân bản thành công",
  //         description: "Sản phẩm đã được nhân bản thành công",
  //       })
  //     }
  //   } catch (err: any) {
  //     toast({
  //       title: "Lỗi",
  //       description: err.message || "Không thể nhân bản sản phẩm",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setDuplicatingProductId(null)
  //   }
  // }

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0

    let valueA, valueB

    switch (sortField) {
      case "name":
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
        break
      case "price":
        valueA = a.price
        valueB = b.price
        break
      case "stock":
        valueA = a.stock_quantity
        valueB = b.stock_quantity
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate discount percentage
  const calculateDiscount = (price: number, originalPrice: number | undefined) => {
    if (!originalPrice || originalPrice <= price) return null
    const discount = ((originalPrice - price) / originalPrice) * 100
    return Math.round(discount)
  }

  // Count variants for a product
  const getVariantCount = (product: Product) => {
    return product.variations?.length || 0
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách sản phẩm...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Tag className="h-4 w-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[100px]">Ảnh</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  Tên sản phẩm
                  {sortField === "name" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-1 h-4 w-4",
                        sortDirection === "asc" ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Mã SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                <div className="flex items-center">
                  Giá bán
                  {sortField === "price" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-1 h-4 w-4",
                        sortDirection === "asc" ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
                <div className="flex items-center">
                  Tồn kho
                  {sortField === "stock" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-1 h-4 w-4",
                        sortDirection === "asc" ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead>Biến thể</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const discountPercentage = calculateDiscount(product.price, product.original_price)
                const variantCount = getVariantCount(product)

                return (
                  <>
                    <TableRow key={product.id} className="group cursor-pointer hover:bg-muted/30" onClick={() => variantCount > 0 && toggleProductExpand(product.id)}>
                      <TableCell onClick={(e) => {
                        e.stopPropagation();
                        if (variantCount > 0) toggleProductExpand(product.id);
                      }}>
                        {variantCount > 0 && (
                          <div className="flex items-center justify-center p-1 rounded-sm hover:bg-muted cursor-pointer">
                            {expandedProductIds.has(product.id) ? (
                              <Minus className="h-4 w-4 text-primary" />
                            ) : (
                              <PlusCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-muted/20">
                          <Image
                            src={getImageUrl(product.images?.[0]?.image_path || "")}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.images && product.images.length > 1 && (
                            <div className="absolute bottom-0 right-0 bg-background/80 rounded-tl-md px-1 py-0.5 text-[10px] font-medium">
                              +{product.images.length - 1}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[280px]">
                          <div className="font-medium truncate text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 truncate hidden">ID: {product.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {product.sku || "-"}
                                </span>
                                {product.sku && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(product.sku || "")
                                      toast({
                                        title: "Đã sao chép",
                                        description: "Mã SKU đã được sao chép vào clipboard",
                                      })
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sao chép SKU</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {product.category?.name ? (
                          <Badge variant="outline" className="font-normal text-xs">
                            {product.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </div>

                          {discountPercentage && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-muted-foreground line-through">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                  maximumFractionDigits: 0,
                                }).format(product.original_price || 0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "font-medium text-sm",
                            product.stock_quantity <= 0
                              ? "text-destructive"
                              : product.stock_quantity < 10
                                ? "text-amber-500"
                                : "",
                          )}
                        >
                          {product.stock_quantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        {variantCount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{variantCount}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Không có</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {product.is_new && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800 text-[10px] px-1.5 py-0">Mới</Badge>
                          )}
                          {product.stock_quantity <= 0 && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 text-[10px] px-1.5 py-0">
                              Hết hàng
                            </Badge>
                          )}
                          {!product.is_new && product.stock_quantity > 0 && (
                            <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0">
                              Bình thường
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {/* Actions */}
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePreviewProduct(product.id)}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Variations Row */}
                    {expandedProductIds.has(product.id) && product.variations && product.variations.length > 0 && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={10} className="p-0">
                          <div className="px-10 py-4 bg-muted/10 border-b border-t shadow-inner">
                            <Table className="bg-background rounded-md border text-xs">
                              <TableHeader className="bg-muted/30">
                                <TableRow>
                                  <TableHead className="w-[60px] h-8">Ảnh</TableHead>
                                  <TableHead className="h-8">Mã SKU</TableHead>
                                  <TableHead className="h-8">Thuộc tính</TableHead>
                                  <TableHead className="h-8 text-right">Giá bán</TableHead>
                                  <TableHead className="h-8 text-right">Giá gốc</TableHead>
                                  <TableHead className="h-8 text-center">Tồn kho</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.variations.map((variant) => (
                                  <TableRow key={variant.id} className="hover:bg-muted/30 h-10">
                                    <TableCell className="p-2">
                                      <div className="relative h-8 w-8 rounded overflow-hidden border bg-white">
                                        <Image
                                          src={getImageUrl((variant.images?.[0] as { image_path: string })?.image_path || "")}
                                          alt={variant.sku}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{variant.sku}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-1 flex-wrap">
                                        {variant.attributes && Object.entries(variant.attributes).map(([key, value]) => (
                                          <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                                            {key}: {String(value)}
                                          </span>
                                        ))}
                                        {(!variant.attributes || Object.keys(variant.attributes).length === 0) && (
                                          <span className="text-muted-foreground italic">Mặc định</span>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(variant.price)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                      {(variant.original_price || 0) > 0 ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(variant.original_price || 0) : "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <span className={cn(
                                        variant.stock_quantity <= 0 ? "text-destructive font-medium border-red-200 bg-red-50 px-2 py-0.5 rounded" : "bg-green-50 text-green-700 px-2 py-0.5 rounded border-green-200 border"
                                      )}>
                                        {variant.stock_quantity}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>

                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium">Không tìm thấy sản phẩm nào</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      {searchTerm
                        ? `Không có sản phẩm nào phù hợp với từ khóa "${searchTerm}"`
                        : "Chưa có sản phẩm nào trong hệ thống"}
                    </p>
                    {!searchTerm && (
                      <Link href="/admin/products/create">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm sản phẩm đầu tiên
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={selectedProduct}
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />
    </div>
  )
}
