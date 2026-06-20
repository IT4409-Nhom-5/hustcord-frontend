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
export const createMessage = (targetId: string, payload: { content: string; images?: string[]; parentId?: string }, isDM: boolean = false) => async (_dispatch: any, getState: any) => {
  const user = getState().auth.user;
  if (!user) return;
  
  try {
    const api = (await import('../../services/api')).default;
    await api.post('/messages', {
      text: payload.content,
      userId: user.id,
      channelId: isDM ? undefined : targetId,
      recipientId: isDM ? targetId : undefined,
      images: payload.images || [],
      parentId: payload.parentId
    });
  } catch (error) {
    console.error("Failed to save message to DB:", error);
  }
};

export const deleteMessage = (messageId: string) => async () => {
  try {
    const api = (await import('../../services/api')).default;
    await api.delete(`/messages/${messageId}`);
  } catch (error) {
    console.error("Failed to delete/recall message:", error);
  }
};

export const toggleReaction = (messageId: string, emoji: string) => async () => {
  try {
    const api = (await import('../../services/api')).default;
    await api.post(`/messages/${messageId}/react`, { emoji });
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
  }
};

export default messageSlice.reducer;
