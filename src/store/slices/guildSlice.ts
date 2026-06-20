import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Guild, Channel, User } from '../../types';
import { logout } from './authSlice';

interface GuildState {
  list: Guild[];
  activeGuildId: string | null;
  loading: boolean;
  loaded: boolean;
}

const initialState: GuildState = {
  list: [],
  activeGuildId: null,
  loading: false,
  loaded: false,
};

const guildSlice = createSlice({
  name: 'guilds',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
      state.list = action.payload;
      state.loaded = true;
      state.loading = false;
    },
    fetchGuildsStart: (state) => {
      state.loading = true;
      state.loaded = false;
    },
    setActiveGuild: (state, action: PayloadAction<string>) => {
      state.activeGuildId = action.payload;
    },
    channelCreated: (state, action: PayloadAction<{ guildId: string; channel: Channel }>) => {
      const guild = state.list.find((g) => g.id === action.payload.guildId);
      if (guild && guild.channels) {
        const exists = guild.channels.some(c => c.id === action.payload.channel.id);
        if (!exists) {
          guild.channels.push(action.payload.channel);
        }
      }
    },
    channelDeleted: (state, action: PayloadAction<{ guildId: string; channelId: string }>) => {
      const guild = state.list.find((g) => g.id === action.payload.guildId);
      if (guild && guild.channels) {
        guild.channels = guild.channels.filter((c) => c.id !== action.payload.channelId);
      }
    },
    memberAdded: (state, action: PayloadAction<{ guildId: string; member: User }>) => {
      const guild = state.list.find((g) => g.id === action.payload.guildId);
      if (guild && guild.members) {
        guild.members.push(action.payload.member);
      }
    },
    memberRemoved: (state, action: PayloadAction<{ guildId: string; memberId: string }>) => {
      const guild = state.list.find((g) => g.id === action.payload.guildId);
      if (guild && guild.members) {
        guild.members = guild.members.filter((m) => m.id !== action.payload.memberId);
      }
    },
    inviteCreated: (_state, _action) => {
      // Logic for storing invites if needed
    },
    created: (state, action: PayloadAction<{ guild: Guild }>) => {
      const exists = state.list.some(g => g.id === action.payload.guild.id);
      if (!exists) {
        state.list.push(action.payload.guild);
      }
    },
    deleted: (state, action: PayloadAction<{ guildId: string }>) => {
      state.list = state.list.filter((g) => g.id !== action.payload.guildId);
    },
    updated: (state, action: PayloadAction<{ guild: Guild }>) => {
      const index = state.list.findIndex((g) => g.id === action.payload.guild.id);
      if (index !== -1) {
        state.list[index] = action.payload.guild;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.list = [];
      state.activeGuildId = null;
      state.loading = false;
      state.loaded = false;
    });
  },
});

export const { 
  setGuilds, setActiveGuild, channelCreated, channelDeleted, 
  memberAdded, memberRemoved, inviteCreated, created, deleted, updated,
  fetchGuildsStart
} = guildSlice.actions;
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Guild, Channel, Message } from '../../types/index';

interface GuildState {
  guilds: Guild[];
  activeGuild: Guild | null;
  activeChannel: Channel | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GuildState = {
  guilds: [],
  activeGuild: null,
  activeChannel: null,
  messages: [],
  isLoading: false,
  error: null,
};

const guildSlice = createSlice({
  name: 'guild',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
      state.guilds = action.payload;
    },
    setActiveGuild: (state, action: PayloadAction<Guild | null>) => {
      state.activeGuild = action.payload;
      // Khi chuyển Server khác, ta phải reset Channel và Messages cũ
      state.activeChannel = null;
      state.messages = [];
    },
    setActiveChannel: (state, action: PayloadAction<Channel | null>) => {
      state.activeChannel = action.payload;
      // Khi chuyển Kênh khác, tạm thời xóa tin nhắn trên màn hình chờ load tin nhắn mới
      state.messages = []; 
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Dùng khi nhận được 1 tin nhắn realtime từ socket
    addMessage: (state, action: PayloadAction<Message>) => {
      // Chỉ push vào màn hình nếu tin nhắn đó thuộc về Kênh hiện tại đang mở
      if (state.activeChannel && action.payload.channelId === state.activeChannel.id) {
        state.messages.push(action.payload);
      }
    },
  },
});

export const { setGuilds, setActiveGuild, setActiveChannel, setMessages, addMessage } = guildSlice.actions;
export default guildSlice.reducer;
