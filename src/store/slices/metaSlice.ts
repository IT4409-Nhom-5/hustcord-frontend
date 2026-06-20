import { createSlice } from '@reduxjs/toolkit';

const metaSlice = createSlice({
  name: 'meta',
  initialState: { hasListenedToWS: false },
  reducers: {
    listenedToWS: (state) => { state.hasListenedToWS = true; },
  },
});

export const { listenedToWS } = metaSlice.actions;
export default metaSlice.reducer;
