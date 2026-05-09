import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface UserState {
  list: User[];
}

const initialState: UserState = {
  list: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersFetched: (state, action: PayloadAction<User | User[]>) => {
      const users = Array.isArray(action.payload) ? action.payload : [action.payload];
      users.forEach(user => {
        if (!state.list.find((u) => u.id === user.id)) {
          state.list.push(user);
        }
      });
    },
    userUpdated: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
  },
});

export const { usersFetched, userUpdated } = userSlice.actions;
export default userSlice.reducer;
