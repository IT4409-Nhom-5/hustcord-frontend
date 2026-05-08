import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Lấy các state từ Redux store
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Nếu người dùng đã đăng nhập thành công, tự động chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/channels/@me');
    }
  }, [isAuthenticated, navigate]);

  // Tự động xóa thông báo lỗi nếu người dùng bắt đầu nhập lại thông tin
  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, password, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi Thunk login (Thunk này sẽ tự gọi authService.login bên dưới)
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#313338] p-4">
      <div className="w-full max-w-[480px] rounded-md bg-[#36393f] p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Chào mừng trở lại!</h1>
        <p className="mb-6 text-center text-[#b9bbbe]">Chúng tôi rất mừng vì bạn đã quay lại!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-[#202225] p-2.5 text-white outline-none focus:ring-1 focus:ring-[#5865F2]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-[#202225] p-2.5 text-white outline-none focus:ring-1 focus:ring-[#5865F2]"
              required
            />
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded bg-[#5865F2] py-2.5 font-semibold text-white transition hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#8e9297]">
          Cần một tài khoản?{' '}
          <Link to="/register" className="text-[#00aff4] hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
