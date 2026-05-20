import { create } from 'zustand';
import type { Message } from '~/types';

interface MessageState {
  messages: Message[];
  messagesByChannel: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: Message[]) => void;
  setMessagesByChannel: (channelId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addMessageToChannel: (channelId: string, message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  messagesByChannel: {},
  isLoading: false,
  error: null,
  setMessages: (messages) => set({ messages }),
  setMessagesByChannel: (channelId, messages) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: messages,
      },
    })),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addMessageToChannel: (channelId, message) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...(state.messagesByChannel[channelId] || []), message],
      },
    })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
