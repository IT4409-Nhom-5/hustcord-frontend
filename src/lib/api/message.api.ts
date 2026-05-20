import { apiClient } from './axios';
import type { Message } from '~/types/message';

export const messageAPI = {
  getById: (id: string) =>
    apiClient.get<Message>(`/messages/${id}`),

  getByChannelId: (channelId: string) =>
    apiClient.get<Message[]>(`/messages/channel/${channelId}`),

  create: (data: Partial<Message>) =>
    apiClient.post<Message>('/messages', data),

  update: (id: string, data: Partial<Message>) =>
    apiClient.put<Message>(`/messages/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/messages/${id}`),
};
