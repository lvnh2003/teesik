import { localFetch } from "./core";
import { Order } from "@/type";

export const OrderService = {
  getOrders: async (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    return localFetch<{ data: Order[]; meta?: any }>(`/admin/orders?${query.toString()}`);
  },

  getUserOrders: async (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    return localFetch<{ data: Order[], meta?: any }>(`/orders/user?${query.toString()}`).catch(() => ({ data: [], meta: null }));
  },

  getOrder: async (id: number) => {
    return localFetch<{ data: Order }>(`/admin/orders/${id}`);
  },

  updateOrder: async (id: number, data: Partial<Order>) => {
    return localFetch<{ data: Order }>(`/admin/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  processPayment: async (orderId: number, paymentMethod: string) => {
    return localFetch<unknown>('/payment/process', {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }),
    });
  }
};
