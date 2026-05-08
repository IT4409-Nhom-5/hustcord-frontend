import api from './api';
import type { User } from '../types';

// Dữ liệu gửi lên khi đăng nhập
export interface LoginCredentials {
  email?: string; // Có thể đăng nhập bằng email
  username?: string; // Hoặc username tùy vào backend của bạn
  password: string;
}

// Dữ liệu gửi lên khi đăng ký
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Dữ liệu backend trả về sau khi xác thực thành công
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Gọi API để backend xóa session hoặc vô hiệu hóa Refresh Token (nếu cần)
    // Việc xóa localStorage thường sẽ được xử lý ở Redux Thunk hoặc Component
    await api.post('/auth/logout');
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    // Gửi token cũ/refresh token lên để lấy token mới
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken: token,
    });
    return response.data;
  },
};

export default authService;
