import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  loginStart, loginSuccess, loginFailure, 
  logout, 
  registerStart, registerSuccess, registerFailure 
} = authSlice.actions;

// Giả lập async actions cho register
export const registerUser = (data: any) => async (dispatch: any) => {
  dispatch(registerStart());
  try {
    // Gọi API thực tế ở đây
    console.log('Registering user with data:', data);
    // Tạm thời giả lập thành công
    // dispatch(registerSuccess({ user: { username: data.username }, token: 'fake-token' }));
  } catch (err: any) {
    dispatch(registerFailure(err.message));
  }
};
export const loginUser = (data: any) => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    // Gọi API thực tế ở đây
    console.log('Logging in user with data:', data);
    // Tạm thời giả lập thành công
    // dispatch(loginSuccess({ user: { username: data.username }, token: 'fake-token' }));  
  } catch (err: any) {
    dispatch(loginFailure(err.message));
  }
};
export default authSlice.reducer;
