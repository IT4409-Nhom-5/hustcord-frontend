import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../../types';

interface MessageState {
  list: Message[];
}

const initialState: MessageState = {
  list: [],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageCreated: (state, action: PayloadAction<Message>) => {
      // Avoid duplicates
      if (!state.list.find((m) => m.id === action.payload.id)) {
        state.list.push(action.payload);
      }
    },
    messageDeleted: (state, action: PayloadAction<{ id: string }>) => {
      state.list = state.list.filter((m) => m.id !== action.payload.id);
    },
    messageUpdated: (state, action: PayloadAction<Message>) => {
      const index = state.list.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { messageCreated, messageDeleted, messageUpdated } = messageSlice.actions;

// Async actions
export const createMessage = (targetId: string, payload: { content: string }, isDM: boolean = false) => async (dispatch: any, getState: any) => {
  const user = getState().auth.user || { id: 'user-1', username: 'Guest' };
  
  const newMessage: Message = {
    id: Date.now().toString(),
    channelId: isDM ? undefined : targetId,
    authorId: user.id,
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
