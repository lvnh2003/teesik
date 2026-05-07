import { localFetch } from "./core";
import { Cart, Order } from "@/type";

export const CartService = {
  checkout: async (data: {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    address?: string;
    shipping_fee: number;
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
