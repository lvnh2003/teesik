import Image from "next/image";
import { getImageUrl } from "@/services/core";
import { formatAttributeValue } from "@/lib/utils";
import { CartItem } from "@/type";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  voucherCode?: string | null;
  isCalculatingShipping: boolean;
  t: (key: string) => string;
}

export function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  discountAmount,
  total,
  voucherCode,
  isCalculatingShipping,
  t
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-white border border-black/10 p-8 sticky top-32">
      <h3 className="text-xl font-black tracking-tighter uppercase mb-6">{t("checkout.orderSummary")}</h3>
      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="relative w-20 aspect-[3/4] bg-gray-100 flex-shrink-0">
              <Image src={getImageUrl(item.image)} alt={item.name} fill className="object-cover" />
              <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm uppercase truncate mb-1">{item.name}</h4>
              {item.attributes && Object.keys(item.attributes).length > 0 && (
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  {Object.values(item.attributes).map(val => formatAttributeValue(val)).join(" • ")}
                </p>
              )}
              <p className="font-mono text-sm font-medium">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 pt-6 space-y-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 uppercase tracking-wider text-xs font-sans font-bold">{t("cart.subtotal")}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 uppercase tracking-wider text-xs font-sans font-bold">{t("cart.shipping")}</span>
          <span className={(shippingFee === 0 && subtotal <= 1000000) ? "text-gray-500 text-xs italic" : "text-green-600 font-bold"}>
            {subtotal > 1000000 
              ? t("checkout.free") 
              : isCalculatingShipping 
                ? t("checkout.calculating") 
                : shippingFee > 0 
                  ? formatPrice(shippingFee)
                  : t("checkout.selectAddressPrompt")
            }
          </span>
        </div>
        {voucherCode && (
          <div className="flex justify-between text-green-600">
            <span className="uppercase tracking-wider text-xs font-sans font-bold">Voucher: {voucherCode}</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-4 border-t border-black items-end">
          <span className="text-black uppercase tracking-wider text-sm font-sans font-black">{t("cart.total")}</span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
