import { localFetch } from "./core";
import { Cart, Order } from "@/type";

export const CartService = {
  checkout: async (data: {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    address?: string;
    selected_address_id?: number;
    district_id?: number;
    ward_code?: string;
    payment_method: string;
    payment_id?: string | null;
    discount_amount: number;
    voucher_code?: string; // Tích hợp voucher
    items?: Array<{ product_id: string | number; variation_id?: string | number | undefined; quantity: number; price: number }>;
  }) => {
    return localFetch<{ success: boolean; data?: Order; message?: string; }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
