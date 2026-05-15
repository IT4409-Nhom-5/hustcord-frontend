import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import guildReducer from './slices/guildSlice';
import uiReducer from './slices/uiSlice';
import messageReducer from './slices/messageSlice';
import channelReducer from './slices/channelSlice';
import userReducer from './slices/userSlice';
import metaReducer from './slices/metaSlice';

const persistConfig = {
  key: 'root',
  storage: (storage as any).default || storage, 
  whitelist: ['auth', 'ui', 'guilds', 'messages'] 
};

const rootReducer = combineReducers({
  auth: authReducer,
  guilds: guildReducer,
  ui: uiReducer,
  messages: messageReducer,
  channels: channelReducer,
  users: userReducer,
  meta: metaReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
