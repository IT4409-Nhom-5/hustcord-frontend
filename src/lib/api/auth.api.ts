import { apiClient } from './axios';
import type { AuthLoginRequest, AuthRegisterRequest, AuthResponse } from '~/types/auth';

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: AuthRegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),
};
