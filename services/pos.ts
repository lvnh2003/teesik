import { localFetch } from "./core";
import { Customer, Transaction, Purchase, Promotion, Voucher, Combo } from "@/type";

type PaginatedResponse<T> = { data: T[]; meta?: any };

function buildQuery(params: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  return query.toString();
}

export const PosService = {
  getCustomers: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    return localFetch<PaginatedResponse<Customer>>(`/admin/customers?${buildQuery(params)}`);
  },

  createCustomer: async (data: any) => {
    return localFetch<{ data: Customer }>('/admin/customers', { method: 'POST', body: JSON.stringify(data) });
  },

  getTransactions: async (params: { page?: number; limit?: number } = {}) => {
    return localFetch<PaginatedResponse<Transaction>>(`/admin/transactions?${buildQuery(params)}`);
  },

  getPurchases: async (params: { page?: number; limit?: number } = {}) => {
    return localFetch<PaginatedResponse<Purchase>>(`/admin/purchases?${buildQuery(params)}`);
  },

  getPromotions: async (params: { page?: number; limit?: number } = {}) => {
    return localFetch<PaginatedResponse<Promotion>>(`/admin/promotions?${buildQuery(params)}`);
  },



  getVouchers: async (params: { page?: number; limit?: number } = {}) => {
    return localFetch<PaginatedResponse<Voucher>>(`/admin/vouchers?${buildQuery(params)}`);
  },



  getCombos: async (params: { page?: number; limit?: number } = {}) => {
    return localFetch<PaginatedResponse<Combo>>(`/admin/combos?${buildQuery(params)}`);
  },



  getSalesAnalytics: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    return localFetch<{ data: any }>(`/admin/statistics/sales?${query.toString()}`);
  },

  getInventoryAnalytics: async () => {
    return localFetch<{ data: any }>('/admin/statistics/inventory');
  }
};
