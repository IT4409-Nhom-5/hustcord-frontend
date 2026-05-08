import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import type { LoginCredentials, RegisterCredentials } from '../../services/authService';
import type { User } from '../../types/index';

// Khai báo kiểu dữ liệu cho Auth State
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Khởi tạo State ban đầu
// Nếu user đã F5 trang, ta lấy lại token từ localStorage (nếu có)
const savedToken = localStorage.getItem('token');
const initialState: AuthState = {
  user: null,
  token: savedToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!savedToken, // Khởi tạo true nếu có sẵn token
};

// Thunk: Xử lý Đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Lưu token vào localStorage để giữ trạng thái đăng nhập
      localStorage.setItem('token', response.accessToken);
      return response; // Trả về payload cho fulfilled
    } catch (error: any) {
      // Trả về câu thông báo lỗi từ backend
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// Thunk: Xử lý Đăng ký
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      localStorage.setItem('token', response.accessToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

// Thunk: Xử lý Đăng xuất
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
    } catch (error: any) {
      // Dù API gọi bị lỗi (ví dụ hết hạn token) thì vẫn phải xóa token ở client
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Đăng xuất có lỗi');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Hàm dọn dẹp lỗi (ví dụ khi user gõ lại mật khẩu)
    clearError: (state) => {
      state.error = null;
    },
    // Hàm dùng để gán user data khi khởi động app (nếu có token)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  // Lắng nghe các action từ createAsyncThunk
  extraReducers: (builder) => {
    builder
      // -- LOGIN --
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // -- REGISTER -- (Xử lý tương tự login)
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // -- LOGOUT --
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // (Tùy chọn) Có thể xử lý logout.rejected nếu muốn hiển thị lỗi,
      // nhưng thường ta cứ clear state bất chấp thành công hay lỗi
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
