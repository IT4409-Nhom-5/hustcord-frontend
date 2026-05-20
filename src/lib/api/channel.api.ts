import { apiClient } from './axios';
import type { Channel } from '~/types/channel';

export const channelAPI = {
  getById: (id: string) =>
    apiClient.get<Channel>(`/channels/${id}`),

  getByUserId: (userId: string) =>
    apiClient.get<Channel[]>(`/channels/user/${userId}`),

  create: (data: Partial<Channel>) =>
    apiClient.post<Channel>('/channels', data),

  update: (id: string, data: Partial<Channel>) =>
    apiClient.put<Channel>(`/channels/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/channels/${id}`),
};
