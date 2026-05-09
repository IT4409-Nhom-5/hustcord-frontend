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
export const createMessage = (targetId: string, payload: any, isDM: boolean = false) => async (dispatch: any, getState: any) => {
  const user = getState().auth.user || { id: 'user-1', username: 'Guest' };
  
  const newMessage = {
    id: Date.now().toString(),
    channelId: isDM ? undefined : targetId,
    userId: isDM ? targetId : undefined, // Đối với DM, userId là ID của người nhận
    content: payload.content,
    author: user,
    createdAt: new Date().toISOString(),
  };

  dispatch(messageCreated(newMessage));
  
  import('../../services/ws').then((module) => {
    if (module.default.connected) {
      const eventName = isDM ? 'DM_CREATE' : 'MESSAGE_CREATE';
      module.default.emit(eventName, { 
        [isDM ? 'userId' : 'channelId']: targetId, 
        message: newMessage 
      });
    }
  });
};

export default messageSlice.reducer;
