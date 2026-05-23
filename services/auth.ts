import { localFetch, getAuthToken } from "./core";
import { setCookie, deleteCookie } from "cookies-next";
import { useCallback } from "react";
import { User } from "@/type";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/type/auth";

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return localFetch<AuthResponse>('/login', {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return localFetch<AuthResponse>('/register', {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updateProfile: async (data: { name: string; phone?: string }) => {
    return localFetch<{ success: boolean; data: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    return localFetch<{ success: boolean; data: { user: User } }>('/me');
  },

  getUsers: async (page = 1, limit = 10): Promise<{ data: User[] }> => {
    return localFetch<{ data: User[] }>(`/admin/users?page=${page}&limit=${limit}`);
  },

  getUser: async (id: number): Promise<{ data: User }> => {
    return localFetch<{ data: User }>(`/admin/users/${id}`);
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<{ data: User }> => {
    return localFetch<{ data: User }>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData)
    });
  },

  deleteUser: async (id: number): Promise<{ success: boolean }> => {
    return localFetch<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" });
  },

  getDashboardStats: async (): Promise<{ data: { total_products?: number; total_users?: number; total_orders?: number; recent_orders?: unknown[]; revenue?: { daily?: number; weekly?: number; monthly?: number } } }> => {
    return localFetch<{ data: { total_products?: number; total_users?: number; total_orders?: number; recent_orders?: unknown[]; revenue?: { daily?: number; weekly?: number; monthly?: number } } }>("/admin/dashboard");
  },

  // Token management
  setAuthToken: (token: string): void => {
    setCookie("auth_token", token, { maxAge: 60 * 60 * 24, path: "/" }); // 1 day
  },

  getAuthToken: (): string | null => {
    return getAuthToken();
  },

  removeAuthToken: (): void => {
    deleteCookie("auth_token", { path: "/" });
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  checkAdminRole: async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await localFetch<{ success: boolean; data: { user: User } }>('/admin/check');
      return response.data.user.role?.toLowerCase() === "admin";
    } catch {
      AuthService.removeAuthToken();
      return false;
    }
  }
};

export function useAdminAuth() {
  const checkAuth = useCallback(async () => {
    const isAdmin = await AuthService.checkAdminRole();
    if (!isAdmin && typeof window !== "undefined") {
      AuthService.removeAuthToken();
      window.location.href = `/admin/login/?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }, []);

  return { checkAuth };
}
