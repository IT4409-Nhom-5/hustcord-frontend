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
  channels?: Channel[];
  members?: User[];
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  author?: User; // Thông tin người gửi (thường được backend populate chung khi fetch)
  channelId?: string;
  userId?: string; // Tương đương authorId trong một số trường hợp backend
  recipientId?: string; // ID người nhận nếu là DM
  createdAt: string;
  updatedAt?: string;
}
