import { localFetch } from "./core";
import { User, type PaginatedResponse } from "@/type";

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

  createUser: async (data: { name: string; email: string; password?: string; role?: string }) => {
    return localFetch<{ data: User }>('/admin/users', { method: 'POST', body: JSON.stringify(data) });
  },

  updateUser: async (id: string | number, data: Partial<User>) => {
    return localFetch<{ data: User }>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  deleteUser: async (id: string | number) => {
    return localFetch<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' });
  }
};
