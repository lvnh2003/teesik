import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-xl font-bold tracking-wider">TEESIK</span>
            </Link>
            <p className="text-gray-400 mb-6">{t("footer.description")}</p>
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
            <h3 className="font-bold text-sm tracking-wider mb-6">
              {t("footer.customerService")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/return-policy" className="text-gray-400 hover:text-white">
                  {t("footer.returnPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="text-gray-400 hover:text-white">
                  {t("footer.warrantyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
                  {t("footer.privacyPolicyPage")}
                </Link>
              </li>
              <li>
                <Link href="/shopping-guide" className="text-gray-400 hover:text-white">
                  {t("footer.shoppingGuide")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-400 hover:text-white">
                  {t("footer.shippingPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/payment-guide" className="text-gray-400 hover:text-white">
                  {t("footer.paymentGuide")}
                </Link>
              </li>
              <li>
                <Link href="/inspection-policy" className="text-gray-400 hover:text-white">
                  {t("footer.inspectionPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm tracking-wider mb-6">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li>{t("footer.email")}</li>
              <li>{t("footer.phone")}</li>
              <li>{t("footer.address")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{t("footer.copyright")}</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img
                src="/placeholder.svg?height=30&width=50"
                alt="Visa"
                className="h-8"
              />
              <img
                src="/placeholder.svg?height=30&width=50"
                alt="Mastercard"
                className="h-8"
              />
              <img
                src="/placeholder.svg?height=30&width=50"
                alt="PayPal"
                className="h-8"
              />
              <img
                src="/placeholder.svg?height=30&width=50"
                alt="Apple Pay"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
