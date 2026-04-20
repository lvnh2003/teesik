import { localFetch } from "./core";

export const VoucherService = {
  validate: async (code: string, cartTotal: number) => {
    return localFetch<{ 
        success: boolean; 
        data?: { 
            code: string, 
            discount: number, 
            is_percent: boolean, 
            voucher_details: any 
        }; 
        message?: string;
    }>('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cart_total: cartTotal }),
    });
  }
};
