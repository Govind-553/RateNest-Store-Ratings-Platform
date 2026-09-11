import { apiClient } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    address: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<User> {
    return apiClient<User>('/auth/me', {
      method: 'GET',
    });
  },
};
