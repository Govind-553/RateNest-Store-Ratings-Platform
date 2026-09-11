import { apiClient } from './api';
import type { AdminDashboardStats, PaginatedResponse, Role, Store, User } from '../types';

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  email?: string;
  address?: string;
  role?: Role;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminStoreQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  email?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return apiClient<AdminDashboardStats>('/admin/dashboard', {
      method: 'GET',
    });
  },

  async getUsers(params: AdminUserQueryParams = {}): Promise<PaginatedResponse<User>> {
    return apiClient<PaginatedResponse<User>>('/admin/users', {
      method: 'GET',
      params: params as any,
    });
  },

  async getUserById(id: string): Promise<User> {
    return apiClient<User>(`/admin/users/${id}`, {
      method: 'GET',
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    address: string;
    password: string;
    role: Role;
  }): Promise<User> {
    return apiClient<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getStores(params: AdminStoreQueryParams = {}): Promise<PaginatedResponse<Store>> {
    return apiClient<PaginatedResponse<Store>>('/admin/stores', {
      method: 'GET',
      params: params as any,
    });
  },

  async createStore(data: {
    name: string;
    email: string;
    address: string;
    ownerId?: string;
  }): Promise<Store> {
    return apiClient<Store>('/admin/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
