import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { register, clearError } from '../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/channels/@me');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, username, password, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email, username, password }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#313338] p-4">
      <div className="w-full max-w-[480px] rounded-md bg-[#36393f] p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Tạo tài khoản</h1>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </form>

        <p className="mt-4 text-sm text-[#8e9297]">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#00aff4] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
