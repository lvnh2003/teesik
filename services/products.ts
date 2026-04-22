import { localFetch } from "./core";
import { Product, ProductFormData, Category } from "@/type/product";
import { PaginationMeta, type PaginatedResponse } from "@/type";

export type ProductQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number | string;
  status?: 'new' | 'featured' | 'active' | 'inactive' | 'out_of_stock' | 'low_stock';
  is_new?: string | boolean;
  is_featured?: string | boolean;
  sort_field?: 'name' | 'created_at' | 'updated_at';
  sort_direction?: 'asc' | 'desc';
};

type ProductsApiResponse = {
  data: Product[];
  meta?: { current_page?: number; from?: number | null; last_page?: number; per_page?: number; to?: number | null; total?: number };
  current_page?: number;
  from?: number | null;
  last_page?: number;
  per_page?: number;
  to?: number | null;
  total?: number;
};

export const ProductService = {
  getProducts: async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
    const queryString = query.toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;

    const response = await localFetch<ProductsApiResponse>(url);

    if (response.data && Array.isArray(response.data)) {
      const meta: PaginationMeta = {
        current_page: response.meta?.current_page ?? response.current_page ?? 1,
        from: response.meta?.from ?? response.from ?? null,
        last_page: response.meta?.last_page ?? response.last_page ?? 1,
        per_page: response.meta?.per_page ?? response.per_page ?? 15,
        to: response.meta?.to ?? response.to ?? null,
        total: response.meta?.total ?? response.total ?? 0,
      };
      return { data: response.data as Product[], meta };
    }
    return { data: [], meta: { current_page: 1, last_page: 0, per_page: 0, total: 0 } };
  },

  getProduct: async (id: string | number) => {
    return localFetch<{ data: Product }>(`/products/${id}`);
  },

  createProduct: async (productData: ProductFormData) => {
    if (productData.images && productData.images.length > 0) {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key !== "images") {
          formData.append(key, String(productData[key as keyof ProductFormData]));
        }
      });
      productData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      return localFetch<{ data: Product }>("/admin/products", {
        method: "POST",
        body: formData,
      });
    }

    return localFetch<{ data: Product }>("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId: string | number, formData: FormData) => {
    return localFetch<{ data: Product }>(`/admin/products/${productId}`, {
      method: "POST", // Laravel style PUT over POST
      body: formData,
    });
  },

  deleteProduct: async (id: string | number) => {
    return localFetch<{ success: boolean }>(`/admin/products/${id}`, { method: "DELETE" });
  },

  getCategories: async () => {
    return localFetch<{ data: Category[] }>("/categories");
  },

  createCategory: async (name: string) => {
    return localFetch<{ data: Category }>("/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  updateCategory: async (id: number, data: { name: string }) => {
    return localFetch<{ data: Category }>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: number) => {
    return localFetch<{ success: boolean }>(`/admin/categories/${id}`, { method: "DELETE" });
  }
};
