import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-xl font-bold tracking-wider">TEESIK</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Cung cấp túi xách thời trang cao cấp và giải pháp dropshipping toàn cầu.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider mb-6">SHOP</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/collections/new-arrivals" className="text-gray-400 hover:text-white">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/best-sellers" className="text-gray-400 hover:text-white">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/collections/tote-bags" className="text-gray-400 hover:text-white">
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link href="/collections/crossbody" className="text-gray-400 hover:text-white">
                  Crossbody
                </Link>
              </li>
              <li>
                <Link href="/collections/backpacks" className="text-gray-400 hover:text-white">
                  Backpacks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider mb-6">INFORMATION</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dropshipping" className="text-gray-400 hover:text-white">
                  Dropshipping
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider mb-6">CONTACT</h3>
            <ul className="space-y-4 text-gray-400">
              <li>Email: info@teesik.com</li>
              <li>Phone: +84 123 456 789</li>
              <li>Address: 123 Street Name, District, City, Vietnam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 LUXEBAGS. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8" />
              <img src="/placeholder.svg?height=30&width=50" alt="Apple Pay" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
