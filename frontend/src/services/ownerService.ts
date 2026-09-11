import { apiClient } from './api';
import type { OwnerDashboardData } from '../types';

export const ownerService = {
  async getDashboard(): Promise<OwnerDashboardData> {
    return apiClient<OwnerDashboardData>('/owner/dashboard', {
      method: 'GET',
    });
  },
};
