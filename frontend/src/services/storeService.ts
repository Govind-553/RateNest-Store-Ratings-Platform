import { apiClient } from './api';
import type { PaginatedResponse, Store } from '../types';

export interface StoreQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const storeService = {
  async getStores(params: StoreQueryParams = {}): Promise<PaginatedResponse<Store>> {
    return apiClient<PaginatedResponse<Store>>('/stores', {
      method: 'GET',
      params: params as any,
    });
  },

  async getStore(id: string): Promise<Store> {
    return apiClient<Store>(`/stores/${id}`, {
      method: 'GET',
    });
  },

  async rateStore(storeId: string, value: number): Promise<{ message: string; averageRating: number; totalRatings: number }> {
    return apiClient(`/stores/${storeId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  },

  async updateRating(storeId: string, value: number): Promise<{ message: string; averageRating: number; totalRatings: number }> {
    return apiClient(`/stores/${storeId}/ratings`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
  },
};
