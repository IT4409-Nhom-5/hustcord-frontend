/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GuildState {
  list: any[];
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
    setGuilds: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
    setActiveGuild: (state, action: PayloadAction<string>) => {
      state.activeGuildId = action.payload;
    },
    channelCreated: (state, action) => {
      const guild = state.list.find((g: any) => g.id === action.payload.guildId);
      if (guild && guild.channels) {
        guild.channels.push(action.payload.channel);
      }
    },
    channelDeleted: (state, action) => {
      const guild = state.list.find((g: any) => g.id === action.payload.guildId);
      if (guild && guild.channels) {
        guild.channels = guild.channels.filter((c: any) => c.id !== action.payload.channelId);
      }
    },
    memberAdded: (state, action) => {
      const guild = state.list.find((g: any) => g.id === action.payload.guildId);
      if (guild && guild.members) {
        guild.members.push(action.payload.member);
      }
    },
    memberRemoved: (state, action) => {
      const guild = state.list.find((g: any) => g.id === action.payload.guildId);
      if (guild && guild.members) {
        guild.members = guild.members.filter((m: any) => m.id !== action.payload.memberId);
      }
    },
    inviteCreated: (state, action) => {
      // Logic for storing invites if needed
    },
    created: (state, action) => {
      state.list.push(action.payload.guild);
    },
    deleted: (state, action) => {
      state.list = state.list.filter((g: any) => g.id !== action.payload.guildId);
    },
    updated: (state, action) => {
      const index = state.list.findIndex((g: any) => g.id === action.payload.guild.id);
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
