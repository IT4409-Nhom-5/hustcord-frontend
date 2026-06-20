import type { User } from '../types';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../services/authService';

// Dữ liệu user giả lập
const mockUser: User = {
  id: 'user-123456',
  username: 'TestUser',
  email: 'test@hust.edu.vn',
  status: 'ONLINE',
  createdAt: new Date().toISOString(),
};

export const mockAuthApi = {
  // Giả lập API Đăng nhập
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Kiểm tra tài khoản test
        if (credentials.email === 'test@hust.edu.vn' && credentials.password === '123456') {
          resolve({
            user: mockUser,
            accessToken: 'mock-jwt-access-token',
            refreshToken: 'mock-jwt-refresh-token',
          });
        } else {
          reject({
            response: {
              data: { message: 'Tài khoản hoặc mật khẩu không đúng. Hãy thử: test@hust.edu.vn / 123456' },
            },
          });
        }
      }, 1000); // Trễ 1 giây để thấy được trạng thái loading
    });
  },

  // Giả lập API Đăng ký (Luôn cho thành công để dễ test)
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            ...mockUser,
            username: credentials.username,
            email: credentials.email,
          },
          accessToken: 'mock-jwt-access-token',
        });
      }, 1000);
    });
  },
};