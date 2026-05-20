import type { User } from './user';

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  statusCode: string;
  message?: string;
  access_token: string;
  user?: User;
}
