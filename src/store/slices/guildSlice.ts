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
