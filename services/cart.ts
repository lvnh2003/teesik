import { localFetch } from "./core";
import { Cart, Order } from "@/type";

export const CartService = {
  checkout: async (data: {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    address?: string;
    payment_method?: string;
    items?: Array<{ product_id: string | number; variation_id?: string | number | undefined; quantity: number; price: number }>;
  }) => {
    return localFetch<{ success: boolean; order?: Order; message?: string; }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
