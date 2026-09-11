import { apiClient } from './api';

export const userService = {
  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
