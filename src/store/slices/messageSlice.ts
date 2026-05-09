/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'messages',
  initialState: { list: [] },
  reducers: {
    messageCreated: (state, action) => {
      // Avoid duplicates
      if (!state.list.find((m: any) => m.id === action.payload.id)) {
        state.list.push(action.payload);
      }
    },
    messageDeleted: (state, action) => {
      state.list = state.list.filter((m: any) => m.id !== action.payload.id);
    },
    messageUpdated: (state, action) => {
      const index = state.list.findIndex((m: any) => m.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { messageCreated, messageDeleted, messageUpdated } = messageSlice.actions;

// Async actions
export const createMessage = (channelId: string, payload: any) => async (dispatch: any, getState: any) => {
  // In Phase 5, since API is not ready, we simulate adding a message to Redux directly
  const user = getState().auth.user || { id: 'user-1', username: 'Guest' };
  
  const newMessage = {
    id: Date.now().toString(),
    channelId,
    content: payload.content,
    author: user,
    createdAt: new Date().toISOString(),
  };

  dispatch(messageCreated(newMessage));
  
  // Here we would emit to WS:
  import('../../services/ws').then((module) => {
    if (module.default.connected) {
      module.default.emit('MESSAGE_CREATE', { channelId, message: newMessage });
    }
  });
};

export default messageSlice.reducer;
