import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { SmartphoneIcon, ShoppingBag } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  setMomoPayment: (v: any) => void;
  setQrPayment: (v: any) => void;
  qrPayment: any;
  momoPayment: any;
  total: number;
  formatPrice: (price: number) => string;
  handleCheckQrPayment: () => void;
  isSubmitting: boolean;
  t: (key: string) => string;
}

export function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  setMomoPayment,
  setQrPayment,
  qrPayment,
  momoPayment,
  total,
  formatPrice,
  handleCheckQrPayment,
  isSubmitting,
  t
}: PaymentMethodsProps) {
  return (
    <RadioGroup value={paymentMethod} onValueChange={(value) => {
      setPaymentMethod(value)
      if (value !== "momo") setMomoPayment(null)
      if (value !== "qr") setQrPayment(null)
    }} className="space-y-4">
      <Label
        htmlFor="qr"
        className={`flex items-start space-x-4 p-6 border transition-all cursor-pointer ${paymentMethod === 'qr' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
      >
        <RadioGroupItem value="qr" id="qr" className="mt-1 border-white" />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <SmartphoneIcon className="h-5 w-5 mr-2" />
            <span className="font-bold uppercase tracking-wider">{t("checkout.qrPayment")}</span>
          </div>
          <p className={`text-sm ${paymentMethod === 'qr' ? 'text-white/70' : 'text-gray-500'}`}>{t("checkout.qrDesc")}</p>

          {paymentMethod === 'qr' && (
            <div className="mt-6 p-4 bg-white max-w-[200px] mx-auto text-black text-center">
              {qrPayment?.qrCodeUrl ? (
                <div className="aspect-square bg-gray-100 mb-2 relative">
                  <Image
                    src={qrPayment.qrCodeUrl}
                    alt="QR Code"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 mb-2 flex items-center justify-center px-3">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t("checkout.qrPending")}</span>
                </div>
              )}
              <p className="font-mono font-bold text-lg">{formatPrice(qrPayment?.amount || total)}</p>
              {qrPayment?.paymentCode && (
                <div className="mt-2 border border-black/10 p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{t("checkout.qrPaymentCode")}</p>
                  <p className="font-mono text-sm font-black break-all">{qrPayment.paymentCode}</p>
                </div>
              )}
              {qrPayment?.orderId && (
                <Button
                  type="button"
                  onClick={handleCheckQrPayment}
                  disabled={isSubmitting}
                  className="mt-3 h-9 w-full rounded-none bg-black text-white text-[10px] uppercase font-bold tracking-widest"
                >
                  {t("checkout.qrRefresh")}
                </Button>
              )}
            </div>
          )}
        </div>
      </Label>

      <Label
        htmlFor="momo"
        className={`flex items-start space-x-4 p-6 border transition-all cursor-pointer ${paymentMethod === 'momo' ? 'border-[#A50064] bg-[#A50064] text-white' : 'border-gray-200 hover:border-[#A50064]'}`}
      >
        <RadioGroupItem value="momo" id="momo" className="mt-1 border-white" />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center mr-2">
               <div className="w-3 h-3 bg-[#A50064] rounded-full" />
            </div>
            <span className="font-bold uppercase tracking-wider">{t("checkout.momoPayment")}</span>
          </div>
          <p className={`text-sm ${paymentMethod === 'momo' ? 'text-white/70' : 'text-gray-500'}`}>{t("checkout.momoDesc")}</p>

          {paymentMethod === 'momo' && (
            <div className="mt-6 p-4 bg-white max-w-[200px] mx-auto text-black text-center border-2 border-[#A50064]">
              {momoPayment?.qrCodeUrl ? (
                <div className="aspect-square bg-gray-50 mb-2 relative flex items-center justify-center">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(momoPayment.qrCodeUrl)}`}
                    alt="MoMo QR"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-50 mb-2 flex items-center justify-center px-3">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t("checkout.momoQrPending")}</span>
                </div>
              )}
              <p className="font-mono font-bold text-lg text-[#A50064]">{formatPrice(total)}</p>
              {momoPayment?.deeplink && (
                <a href={momoPayment.deeplink} className="mt-3 inline-flex text-xs font-bold uppercase tracking-widest underline text-[#A50064]">
                  {t("checkout.openMomo")}
                </a>
              )}
            </div>
          )}
        </div>
      </Label>

      <Label
        htmlFor="cod"
        className={`flex items-start space-x-4 p-6 border transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
      >
        <RadioGroupItem value="cod" id="cod" className="mt-1 border-white" />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <ShoppingBag className="h-5 w-5 mr-2" />
            <span className="font-bold uppercase tracking-wider">{t("checkout.cod")}</span>
          </div>
          <p className={`text-sm ${paymentMethod === 'cod' ? 'text-white/70' : 'text-gray-500'}`}>{t("checkout.codDesc")}</p>
        </div>
      </Label>
    </RadioGroup>
  );
}
