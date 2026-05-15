import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Guild, Channel, User } from '../../types';

interface GuildState {
  list: Guild[];
  activeGuildId: string | null;
  loading: boolean;
}

const initialState: GuildState = {
  list: [],
  activeGuildId: null,
  loading: false,
};

const guildSlice = createSlice({
  name: 'guilds',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
      state.list = action.payload;
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
});

export const { 
  setGuilds, setActiveGuild, channelCreated, channelDeleted, 
  memberAdded, memberRemoved, inviteCreated, created, deleted, updated 
} = guildSlice.actions;
export default guildSlice.reducer;
