import { localFetch } from "./core";

export const WishlistService = {
  fetchWishlists: async () => {
    return localFetch<{ success: boolean; data: any[] }>('/wishlists', {
      method: 'GET',
    });
  },
  toggleWishlist: async (productId: string | number) => {
    return localFetch<{ success: boolean; data: { status: string, wishlist_ids: (string|number)[] }; message?: string }>('/wishlists/toggle', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }
};
