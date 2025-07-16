"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createCategory, // Đã đổi tên hàm để tránh nhầm lẫn với getCategories
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/admin-api"
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Category } from "@/type/product"

const categorySchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục không được để trống." }),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data }= await getCategories() 
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, []) // Chạy một lần khi component mount

  const handleOpenDialog = (category?: Category) => {
    setEditingCategory(category || null)
    if (category) {
      form.reset({ name: category.name })
    } else {
      form.reset({ name: "" })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    form.reset()
  }

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      let result
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, values)
      } else {
        result = await createCategory(values.name)
      }

      if (result.data) {
        console.log(`Danh mục đã được ${editingCategory ? "cập nhật" : "thêm mới"} thành công.`)
        fetchCategories()
        handleCloseDialog()
      } else {
        console.error(`Lỗi: Không thể ${editingCategory ? "cập nhật" : "thêm mới"} danh mục.`)
      }
    } catch (error) {
      console.error("Error submitting category:", error)
      console.error("Lỗi: Đã xảy ra lỗi khi gửi danh mục. Vui lòng thử lại.")
    }
  }

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (categoryToDelete === null) return

    try {
      const result = await deleteCategory(categoryToDelete)
      console.log(result);
      
      if (result.success) {
        console.log("Danh mục đã được xóa thành công.")
        fetchCategories() // Tải lại danh sách sau khi thành công
      } else {
        console.error("Lỗi: Không thể xóa danh mục.")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      console.error("Lỗi: Đã xảy ra lỗi khi xóa danh mục. Vui lòng thử lại.")
    } finally {
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm Danh mục Mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Tên Danh mục</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    Không có danh mục nào.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenDialog(category)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(category.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Chỉnh sửa thông tin danh mục." : "Thêm một danh mục mới vào hệ thống."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input id="name" {...form.register("name")} className="col-span-3" />
            </div>
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm text-right col-span-4 -mt-2">{form.formState.errors.name.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Lưu thay đổi" : "Thêm Danh mục"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
