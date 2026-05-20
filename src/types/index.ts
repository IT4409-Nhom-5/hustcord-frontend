// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  about?: string;
  image?: string;
  friends?: string[];
  blocked?: string[];
  requests?: string[];
}

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

// Channel Types
export interface Channel {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  participants: string[];
  admins?: string[];
}

// Message Types
export interface Message {
  id?: string;
  channelId: string;
  userId: string;
  text: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    username: string;
    image?: string;
  };
}

// Video Types
export interface VideoCall {
  callId: string;
  channelId: string;
  callerId: string;
  status: 'active' | 'ended' | 'missed';
  participants: string[];
  createdAt: string;
  endedAt?: string;
}

