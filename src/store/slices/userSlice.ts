/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: { list: [] },
  reducers: {
    usersFetched: (state, action) => {
      const users = Array.isArray(action.payload) ? action.payload : [action.payload];
      users.forEach(user => {
        if (!state.list.find((u: any) => u.id === user.id)) {
          state.list.push(user);
        }
      });
    },
    userUpdated: (state, action) => {
      const index = state.list.findIndex((u: any) => u.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
  },
});

export const { usersFetched, userUpdated } = userSlice.actions;
export default userSlice.reducer;
