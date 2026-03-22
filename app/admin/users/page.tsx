"use client"

import { useEffect, useState } from "react"
import { UsersService } from "@/services/users"
import { User } from "@/type"
import { Loader2, Plus, Edit, Trash2, Search, ShieldCheck } from "lucide-react"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)

    // Form states
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "staff" })
    const [submitLoading, setSubmitLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await UsersService.getUsers({
                page: currentPage,
                limit: 10,
                search: searchQuery
            })
            setUsers(response.data)
            if (response.meta) {
                setTotalPages(response.meta.last_page || 1)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string | number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.")) return;
        try {
            await UsersService.deleteUser(id);
            alert("Xóa tài khoản thành công!");
            fetchUsers();
        } catch (error: any) {
            console.error("Failed to delete user", error);
            alert("Lỗi khi xóa tài khoản: " + (error.message || 'Unknown error'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitLoading(true)
        try {
            if (userToEdit) {
                // Remove password from payload if empty when updating
                const payload = { ...formData };
                if (!payload.password) delete (payload as any).password;

                await UsersService.updateUser(userToEdit.id, payload);
                alert("Cập nhật thành công!");
            } else {
                await UsersService.createUser(formData);
                alert("Tạo tài khoản thành công!");
            }
            closeModal();
            fetchUsers();
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        } finally {
            setSubmitLoading(false);
        }
    }

    const openCreateModal = () => {
        setFormData({ name: "", email: "", password: "", role: "staff" })
        setUserToEdit(null)
        setIsCreateModalOpen(true)
    }

    const openEditModal = (user: User) => {
        setUserToEdit(user)
        setFormData({ name: user.name, email: user.email, password: "", role: user.role || "staff" })
        setIsCreateModalOpen(true)
    }

    const closeModal = () => {
        setIsCreateModalOpen(false)
        setUserToEdit(null)
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [currentPage, searchQuery])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Quản trị viên & Nhân viên</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Thêm tài khoản
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Họ và Tên</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phân quyền</th>
                                    <th className="px-6 py-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Không tìm thấy tài khoản nào
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                #{user.id}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <ShieldCheck className={`h-4 w-4 ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`} />
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        user.role === 'admin' ? "bg-red-100 text-red-800" :
                                                        user.role === 'staff' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {user.role ? user.role.toUpperCase() : "STAFF"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                        Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Create/Edit */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-20 pb-10">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden mt-8">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">{userToEdit ? "Sửa tài khoản" : "Thêm tài khoản mới"}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                                <span className="sr-only">Đóng</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-black"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-black"
                                    disabled={!!userToEdit} // Do not allow changing email easily
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu {userToEdit && <span className="font-normal text-xs text-gray-500">(Bỏ trống nếu không đổi)</span>}</label>
                                <input
                                    required={!userToEdit}
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-black"
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phân quyền</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-black"
                                >
                                    <option value="admin">Quản trị viên (Admin)</option>
                                    <option value="staff">Nhân viên (Staff)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                                    Hủy
                                </button>
                                <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-70 flex items-center">
                                    {submitLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    {userToEdit ? "Cập nhật" : "Tạo tài khoản"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
