/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { 
    activeGuild: null as any, 
    activeChannel: null as any, 
    openDropdown: false,
    activeModal: null as string | null
  },
  reducers: {
    openedModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closedModal: (state) => { 
      state.activeModal = null;
    },
    focusedInvite: (state, action) => {
      // state.activeInvite = action.payload; 
    },
    toggleDropdown: (state) => { 
      state.openDropdown = !state.openDropdown; 
    },
    pageSwitched: (state, action) => {
      state.activeChannel = action.payload?.channel || null;
      state.activeGuild = action.payload?.guild || null;
    },
  },
});

export const { openedModal, closedModal, focusedInvite, toggleDropdown, pageSwitched } = uiSlice.actions;
export default uiSlice.reducer;
