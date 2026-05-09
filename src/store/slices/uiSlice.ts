/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { 
    activeGuildId: null as string | null, 
    activeChannelId: null as string | null, 
    openDropdown: false,
    activeModal: null as string | null,
    activeCall: null as { userId: string, type: 'voice' | 'video', status: 'calling' | 'connected' } | null,
    activeVoiceChannel: null as { id: string, name: string, guildId: string } | null
  },
  reducers: {
    openedModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closedModal: (state) => { 
      state.activeModal = null;
    },
    startCall: (state, action: PayloadAction<{ userId: string, type: 'voice' | 'video' }>) => {
      state.activeCall = { ...action.payload, status: 'calling' };
    },
    endCall: (state) => {
      state.activeCall = null;
    },
    setCallStatus: (state, action: PayloadAction<'calling' | 'connected'>) => {
      if (state.activeCall) {
        state.activeCall.status = action.payload;
      }
    },
    joinVoiceChannel: (state, action: PayloadAction<{ id: string, name: string, guildId: string }>) => {
      state.activeVoiceChannel = action.payload;
      state.activeCall = null; // Tự động ngắt cuộc gọi cá nhân nếu vào kênh chung
    },
    leaveVoiceChannel: (state) => {
      state.activeVoiceChannel = null;
    },
    focusedInvite: (state, action) => {
      // state.activeInvite = action.payload; 
    },
    toggleDropdown: (state) => { 
      state.openDropdown = !state.openDropdown; 
    },
    pageSwitched: (state, action) => {
      state.activeChannelId = action.payload?.channelId || null;
      state.activeGuildId = action.payload?.guildId || null;
    },
    setGuild: (state, action: PayloadAction<any>) => {
      state.activeGuildId = action.payload?.id || null;
    },
  },
});

export const { 
  openedModal, 
  closedModal, 
  focusedInvite, 
  toggleDropdown, 
  pageSwitched,
  startCall,
  endCall,
  setCallStatus,
  joinVoiceChannel,
  leaveVoiceChannel,
  setGuild
} = uiSlice.actions;
export default uiSlice.reducer;
