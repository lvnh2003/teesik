import { localFetch } from "./core";
import { Order, type PaginatedResponse, type ApiResponse } from "@/type";

export interface PaymentProcessResponse {
  success: boolean;
  data?: {
    order_id: number;
    payment_method: string;
    pay_url?: string | null;
    deeplink?: string | null;
    qr_code_url?: string | null;
    payment_code?: string;
    amount?: number;
    status?: string;
    payment_status?: string;
    transaction_id?: string;
  };
  message?: string;
}

export const OrderService = {
  createOrder: async (data: any) => {
    return localFetch<ApiResponse<Order>>('/orders/checkout', {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getOrders: async (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    return localFetch<PaginatedResponse<Order>>(`/admin/orders?${query.toString()}`);
  },

  getUserOrders: async (params: { page?: number; limit?: number; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    return localFetch<PaginatedResponse<Order>>(`/orders/user?${query.toString()}`);
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

  processPayment: async (orderId: number, paymentMethod: string, paymentToken: string) => {
    return localFetch<PaymentProcessResponse>('/payment/process', {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod, payment_token: paymentToken }),
    });
  },

  verifyMomoReturn: async (params: URLSearchParams) => {
    return localFetch<{ success: boolean; data?: { order_id: number; payment_status: string; result_code: number }; message?: string }>(
      `/payment/momo/return?${params.toString()}`,
    );
  },

  getPaymentStatus: async (orderId: number, paymentToken: string) => {
    return localFetch<{ success: boolean; data?: { order_id: number; payment_method: string; payment_status: string; provider?: string; provider_order_id?: string; provider_transaction_id?: string; paid_at?: string | null }; message?: string }>(
      '/payment/status',
      {
        method: "POST",
        body: JSON.stringify({ order_id: orderId, payment_token: paymentToken }),
      },
    );
  }
};
