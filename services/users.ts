import { localFetch } from "./core";
import { User } from "@/type";

type PaginatedResponse<T> = { data: T[]; meta?: any };

function buildQuery(params: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  return query.toString();
}

export const UsersService = {
  getUsers: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    return localFetch<PaginatedResponse<User>>(`/admin/users?${buildQuery(params)}`);
  },

  createUser: async (data: any) => {
    return localFetch<{ data: User }>('/admin/users', { method: 'POST', body: JSON.stringify(data) });
  },

  updateUser: async (id: string | number, data: any) => {
    return localFetch<{ data: User }>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  deleteUser: async (id: string | number) => {
    return localFetch<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' });
  }
};
