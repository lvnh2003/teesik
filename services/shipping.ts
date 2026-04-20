import { localFetch } from "./core";

export interface Province {
    province_id: number;
    province_name: string;
}

export interface District {
    district_id: number;
    district_name: string;
}

export interface Ward {
    ward_code: string;
    ward_name: string;
}

export const ShippingService = {
  getProvinces: async () => {
    return localFetch<{ success: boolean; data: Province[] }>('/shipping/provinces', {
      method: 'GET',
    });
  },
  
  getDistricts: async (provinceId: number) => {
    return localFetch<{ success: boolean; data: District[] }>(`/shipping/districts?province_id=${provinceId}`, {
      method: 'GET',
    });
  },

  getWards: async (districtId: number) => {
    return localFetch<{ success: boolean; data: Ward[] }>(`/shipping/wards?district_id=${districtId}`, {
      method: 'GET',
    });
  },

  calculateFee: async (districtId: number, wardCode: string, totalValue: number = 0, weight: number = 300) => {
    return localFetch<{ success: boolean; data: { fee: number }; message?: string }>('/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify({ district_id: districtId, ward_code: wardCode, total_value: totalValue, weight }),
    });
  }
};
