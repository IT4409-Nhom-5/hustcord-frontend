import { create } from 'zustand';
import type { User } from '~/types';

interface UserState {
  users: Record<string, User>;
  isLoading: boolean;
  error: string | null;
  addUser: (user: User) => void;
  addUsers: (users: User[]) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  getUser: (id: string) => User | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: {},
  isLoading: false,
  error: null,
  addUser: (user) =>
    set((state) => ({
      users: { ...state.users, [user.id]: user },
    })),
  addUsers: (users) =>
    set((state) => ({
      users: {
        ...state.users,
        ...users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}),
      },
    })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: {
        ...state.users,
        [id]: { ...state.users[id], ...updates },
      },
    })),
  getUser: (id) => get().users[id],
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
