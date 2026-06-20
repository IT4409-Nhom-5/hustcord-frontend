/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const channelSlice = createSlice({
  name: 'channels',
  initialState: { typingUsers: [] as {channelId: string, userId: string}[] },
  reducers: {
    userTyped: (state, action) => {
      const { channelId, userId } = action.payload;
      const index = state.typingUsers.findIndex((t: any) => t.userId === userId && t.channelId === channelId);
      if (index === -1) {
        state.typingUsers.push({ channelId, userId });
      }
    },
    userStoppedTyping: (state, action) => {
      const { channelId, userId } = action.payload;
      state.typingUsers = state.typingUsers.filter((t: any) => !(t.userId === userId && t.channelId === channelId));
    },
  },
});

export const { userTyped, userStoppedTyping } = channelSlice.actions;

export const startTyping = (channelId: string) => (dispatch: any, getState: any) => {
  const user = getState().auth.user;
  if (!user) return;
  
  dispatch(userTyped({ channelId, userId: user.id }));
  
  import('../../services/ws').then((module) => {
    if (module.default.connected) {
      module.default.emit('TYPING_START', { channelId, userId: user.id });
    }
  });
};

export default channelSlice.reducer;
