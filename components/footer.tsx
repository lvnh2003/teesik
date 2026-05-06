import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative large text background */}
      <div className="absolute -bottom-20 -left-10 text-[20vw] font-black text-white/[0.03] select-none pointer-events-none uppercase tracking-tighter leading-none">
        Teesik
      </div>

      <div className="container px-4 md:px-8 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Logo & Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <span className="text-3xl font-black tracking-tighter uppercase">TEESIK</span>
            </Link>
            <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
              {t("footer.description") || "Modern fashion curated for the contemporary lifestyle. Quality, style, and sustainability at the core of everything we do."}
            </p>
            <div className="flex space-x-5">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors p-2 border border-white/10 hover:border-white/30 rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors p-2 border border-white/10 hover:border-white/30 rounded-full">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors p-2 border border-white/10 hover:border-white/30 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors p-2 border border-white/10 hover:border-white/30 rounded-full">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 font-serif text-white/50">
                {t("footer.customerService")}
              </h3>
              <ul className="space-y-4">
                {[
                  { href: "/return-policy", label: t("footer.returnPolicy") },
                  { href: "/warranty-policy", label: t("footer.warrantyPolicy") },
                  { href: "/privacy-policy", label: t("footer.privacyPolicyPage") },
                  { href: "/shopping-guide", label: t("footer.shoppingGuide") },
                  { href: "/shipping-policy", label: t("footer.shippingPolicy") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 font-serif text-white/50">
                {t("footer.shop")}
              </h3>
              <ul className="space-y-4">
                {[
                  { href: "/products", label: t("nav.products") },
                  { href: "/account", label: t("nav.account") },
                  { href: "/cart", label: t("nav.cart") },
                  { href: "/wishlist", label: t("nav.wishlist") },
                  { href: "/about", label: t("nav.about") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 font-serif text-white/50">
              {t("footer.newsletter") || "STAY UPDATED"}
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              {t("footer.newsletterDesc") || "Subscribe to receive updates, access to exclusive deals, and more."}
            </p>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder={t("footer.emailPlaceholder") || "Enter your email"} 
                  className="bg-white/5 border-white/10 rounded-none h-12 pl-12 focus-visible:ring-white/20 text-white placeholder:text-gray-600"
                />
              </div>
              <Button className="rounded-none bg-white text-black hover:bg-gray-200 h-12 px-6">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            {t("footer.copyright") || `© ${new Date().getFullYear()} TEESIK. ALL RIGHTS RESERVED.`}
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">SECURE PAYMENTS</span>
            <div className="flex space-x-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <div className="h-5 w-8 bg-white/20 rounded-sm" title="Visa" />
               <div className="h-5 w-8 bg-white/20 rounded-sm" title="Mastercard" />
               <div className="h-5 w-8 bg-white/20 rounded-sm" title="Paypal" />
               <div className="h-5 w-8 bg-white/20 rounded-sm" title="COD" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
