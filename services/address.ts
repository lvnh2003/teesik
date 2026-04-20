import { localFetch } from "./core";

export interface UserAddress {
    id: number;
    user_id: number;
    receiver_name: string;
    phone: string;
    province_id: number;
    province: string;
    district_id: number;
    district: string;
    ward_code: string;
    ward: string;
    specific_address: string;
    is_default: boolean;
}

export const AddressService = {
  getAddresses: async () => {
    return localFetch<{ success: boolean; data: UserAddress[] }>('/user/addresses', {
      method: 'GET',
    });
  },
  
  createAddress: async (data: Partial<UserAddress>) => {
    return localFetch<{ success: boolean; data: UserAddress; message?: string }>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAddress: async (id: number, data: Partial<UserAddress>) => {
    return localFetch<{ success: boolean; data: UserAddress; message?: string }>(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAddress: async (id: number) => {
    return localFetch<{ success: boolean; message?: string }>(`/user/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  setDefault: async (id: number) => {
    return localFetch<{ success: boolean; data: UserAddress; message?: string }>(`/user/addresses/${id}/default`, {
      method: 'PUT',
    });
  }
};
