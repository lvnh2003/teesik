import { localFetch } from "./core";
import { Cart, Order } from "@/type";

export const CartService = {
  getCart: async () => {
    return localFetch<Cart>('/cart');
  },

  addToCart: async (productId: string | number, quantity: number = 1, variantId?: string | number) => {
    return localFetch<unknown>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity, variant_id: variantId }),
    });
  },

  updateCartItem: async (productId: string | number, quantity: number) => {
    return localFetch<unknown>('/cart/update', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  removeFromCart: async (productId: string | number) => {
    return localFetch<unknown>('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  checkout: async (data: Record<string, unknown>) => {
    return localFetch<{ success: boolean; order?: Order; message?: string; }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
