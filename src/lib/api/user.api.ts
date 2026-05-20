import { apiClient } from './axios';
import type { User } from '~/types/user';

export const userAPI = {
  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),

  search: (query: string) =>
    apiClient.get<User[]>('/users/search', { params: { q: query } }),
};
