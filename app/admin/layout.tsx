"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { checkAdminRole } from "@/lib/admin-auth"
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { removeAuthToken } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null) // State để quản lý submenu đang mở
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const verifyAdmin = async () => {
      // Không kiểm tra nếu đang ở trang /admin/login
      if (pathname === "/admin/login") {
        setIsAdmin(true)
        return
      }

      const adminStatus = await checkAdminRole()
      setIsAdmin(adminStatus)

      if (!adminStatus) {
        router.push("/admin/login")
      }
    }

    verifyAdmin()
  }, [router, pathname])

  // Mở submenu nếu đường dẫn hiện tại thuộc về submenu đó
  useEffect(() => {
    const currentNavItem = navItems.find(
      (item) => item.subItems && item.subItems.some((subItem) => pathname.startsWith(subItem.href)),
    )
    if (currentNavItem && currentNavItem.subItems) {
      setOpenSubmenu(currentNavItem.name)
    } else {
      setOpenSubmenu(null) // Đóng submenu nếu không thuộc về bất kỳ submenu nào
    }
  }, [pathname])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/admin/login")
  }

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name)
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    {
      name: "Sản phẩm",
      href: "/admin/products", // Đây là đường dẫn chính cho mục cha, không nhất thiết phải có trang riêng
      icon: <Package className="h-5 w-5" />,
      subItems: [
        { name: "Danh sách sản phẩm", href: "/admin/products" },
        { name: "Thêm sản phẩm", href: "/admin/products/create" },
        { name: "Danh mục", href: "/admin/categories" }, // Thêm mục danh mục
      ],
    },
    { name: "Người dùng", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Đơn hàng", href: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Cài đặt", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Not admin
  if (isAdmin === false) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold tracking-tight">
            LUXEBAGS ADMIN
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.subItems && item.subItems.some((subItem) => pathname.startsWith(subItem.href)))
              const isSubmenuOpen = openSubmenu === item.name

              return (
                <li key={item.name}>
                  {item.subItems ? (
                    <div className="mb-2">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-800 ${
                          isActive ? "bg-gray-800" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSubmenuOpen && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className={`block px-4 py-2 rounded-lg hover:bg-gray-800 ${
                                    isSubActive ? "bg-gray-800" : ""
                                  }`}
                                  onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when clicking sub-item
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 ${
                        isActive ? "bg-gray-800" : ""
                      }`}
                      onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when clicking item
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-800 text-red-400 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col lg:ml-64 transition-all duration-300 ease-in-out`}>
        {/* Top bar for mobile */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">TEESIK ADMIN</h1>
          <div className="w-6"></div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
