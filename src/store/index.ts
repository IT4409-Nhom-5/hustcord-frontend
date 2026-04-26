import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import guildReducer from './slices/guildSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guilds: guildReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
