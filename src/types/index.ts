// Định nghĩa tất cả các kiểu dữ liệu (TypeScript interfaces/types) dùng chung trong toàn bộ ứng dụng.
// Ví dụ: User, Channel, Message, Guild (Server), Invite, v.v.
// Các file khác sẽ import types từ đây để đảm bảo nhất quán.

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND';
  createdAt: string;
}

export const ChannelType = {
  TEXT: 'TEXT',
  VOICE: 'VOICE',
  CATEGORY: 'CATEGORY'
} as const;

export type ChannelType = typeof ChannelType[keyof typeof ChannelType];

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  guildId: string;
  parentId?: string | null; // Dùng để xác định channel này thuộc Category nào
  position?: number; // Thứ tự hiển thị
  createdAt: string;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  author?: User; // Thông tin người gửi (thường được backend populate chung khi fetch)
  channelId: string;
  createdAt: string;
  updatedAt?: string;
}


