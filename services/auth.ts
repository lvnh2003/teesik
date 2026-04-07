import { localFetch, getAuthToken } from "./core";
import { setCookie, deleteCookie } from "cookies-next";
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
      const user = await AuthService.getCurrentUser();
      return user.data.user.role === "admin";
    } catch {
      return false;
    }
  }
};

export function useAdminAuth() {
  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/admin/login";
    }
  };

  return { checkAuth };
}
