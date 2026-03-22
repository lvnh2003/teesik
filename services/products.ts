import { localFetch } from "./core";
import { Product, ProductFormData, Category } from "@/type/product";

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

export const ProductService = {
  getProducts: async (params: ProductQueryParams = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
    const queryString = query.toString();
    const url = `/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await localFetch<any>(url);
    
    const fakeStock = (products: Product[]) => {
       return products.map(p => {
          if ((p.stock_quantity || 0) <= 0) p.stock_quantity = 100;
          if (p.variations) {
             p.variations = p.variations.map(v => {
                if ((v.stock_quantity || 0) <= 0) v.stock_quantity = 100;
                return v;
             });
          }
          return p;
       });
    };

    if (response.data && Array.isArray(response.data)) {
      if (response.meta) return { data: fakeStock(response.data), meta: response.meta };
      
      const meta = {
        current_page: response.current_page,
        from: response.from,
        last_page: response.last_page,
        per_page: response.per_page,
        to: response.to,
        total: response.total,
      };
      return { data: fakeStock(response.data), meta };
    }
    return { data: [], meta: {} };
  },

  getProduct: async (id: string | number) => {
    return localFetch<{ data: Product }>(`/products/${id}`).then(res => {
        if (res.data) {
           if ((res.data.stock_quantity || 0) <= 0) res.data.stock_quantity = 100;
           if (res.data.variations) {
               res.data.variations = res.data.variations.map(v => {
                  if ((v.stock_quantity || 0) <= 0) v.stock_quantity = 100;
                  return v;
               });
           }
        }
        return res;
    });
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
    return localFetch<{ data: Category[] }>("/admin/categories");
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
