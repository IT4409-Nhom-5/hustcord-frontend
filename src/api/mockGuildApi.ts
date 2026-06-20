import { ChannelType } from '../types';
import type { Guild, Channel } from '../types';

// Dữ liệu Server (Guild) giả lập
export const mockGuilds: Guild[] = [
  {
    id: 'guild-1',
    name: 'HUST - Computer Eng',
    ownerId: 'user-123456',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'guild-2',
    name: 'Gaming Club',
    ownerId: 'user-123456',
    createdAt: new Date().toISOString(),
  }
];

// Dữ liệu Kênh (Channel) giả lập
export const mockChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'general',
    type: ChannelType.TEXT,
    guildId: 'guild-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'channel-2',
    name: 'thông-báo',
    type: ChannelType.TEXT,
    guildId: 'guild-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'channel-3',
    name: 'phòng-chờ',
    type: ChannelType.VOICE,
    guildId: 'guild-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'channel-4',
    name: 'bốc-phét',
    type: ChannelType.TEXT,
    guildId: 'guild-2',
    createdAt: new Date().toISOString(),
  }
];

export const mockGuildApi = {
  // Giả lập API lấy danh sách Server của user
  getGuilds: async (): Promise<Guild[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGuilds), 500);
    });
  },

  // Giả lập API lấy danh sách Channel của một Server cụ thể
  getChannelsByGuildId: async (guildId: string): Promise<Channel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockChannels.filter(c => c.guildId === guildId));
      }, 500);
    });
  }
};