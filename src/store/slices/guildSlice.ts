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
  },
});

export const { setGuilds, setActiveGuild } = guildSlice.actions;
export default guildSlice.reducer;
