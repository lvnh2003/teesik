import { localFetch } from "./core";
import { Cart, Order } from "@/type";

export const CartService = {
  checkout: async (data: any) => {
    return localFetch<{ success: boolean; order?: Order; message?: string; }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
