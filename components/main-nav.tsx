"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, ShoppingBag, User, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import LanguageSwitcher from "@/components/language-switcher"

export default function MainNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { t } = useLanguage()

  const mainNavItems = [
    { label: t("nav.new"), href: "/new" },
    {
      label: "PRODUCTS",
      href: "/products",
      hasDropdown: true,
      dropdownItems: [
        { label: "Túi Đeo Chéo", href: "/products?category=crossbody" },
        { label: "Balo", href: "/products?category=backpacks" },
        { label: "Túi Tote", href: "/products?category=tote-bags" },
        { label: "Túi Clutch", href: "/products?category=clutches" },
        { label: "Túi Đeo Vai", href: "/products?category=shoulder-bags" },
        { label: "Túi Messenger", href: "/products?category=messenger" },
      ],
    },
    { label: t("nav.collections"), href: "/collections" },
    { label: t("nav.about"), href: "/about" },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchValue("")
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-black hover:bg-gray-100">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-white border-gray-200">
              <nav className="flex flex-col gap-8 mt-10">
                {mainNavItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className="text-xl font-bold tracking-wider text-black hover:text-gray-600 transition-colors uppercase"
                    >
                      {item.label}
                    </Link>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-4 mt-4 space-y-3">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase">TEESIK</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-12">
            {mainNavItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.hasDropdown ? (
                  <div className="relative">
                    <Link
                      href={item.href}
                      className="flex items-center text-sm font-bold tracking-wider text-black hover:text-gray-600 transition-colors uppercase relative group"
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    {/* Hover Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-bold tracking-wider text-black hover:text-gray-600 transition-colors uppercase relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isSearchOpen ? (
              <div className="absolute inset-0 bg-white z-50 flex items-center px-4 border-b border-gray-200">
                <div className="container mx-auto flex items-center">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="flex-1 border-0 bg-transparent text-black text-xl font-medium focus-visible:ring-0 placeholder:text-gray-400"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={closeSearch} className="text-black">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close search</span>
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-black hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Link href="/account">
              <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-black hover:bg-gray-100">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
