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
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.list = action.payload;
    },
  },
});

export const { messageCreated, messageDeleted, messageUpdated, setMessages } = messageSlice.actions;

// Async actions
export const createMessage = (targetId: string, payload: { content: string }, isDM: boolean = false) => async (dispatch: any, getState: any) => {
  const user = getState().auth.user;
  if (!user) return;
  
  // Lưu trực tiếp vào Database qua API, Socket sẽ tự động lo việc hiển thị
  try {
    const api = (await import('../../services/api')).default;
    await api.post('/messages', {
      text: payload.content,
      userId: user.id,
      channelId: isDM ? undefined : targetId,
      recipientId: isDM ? targetId : undefined,
      images: []
    });
  } catch (error) {
    console.error("Failed to save message to DB:", error);
  }
};

export default messageSlice.reducer;
