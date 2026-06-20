import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { registerStart, registerSuccess, registerFailure, clearError } from '../store/slices/authSlice';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import api from '../services/api';

import './RegisterPage.scoped.css';

const RegisterPage: React.FC = () => {  
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  // Xóa lỗi cũ khi vào trang
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    dispatch(registerStart());
    try {
      // 1. Đăng ký tài khoản
      await api.post('/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      
      // 2. Đăng ký xong thì tự động Đăng nhập luôn để lấy Token
      const loginResponse = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      // 3. Lưu thông tin vào Redux -> Chuyển trang tự động
      dispatch(registerSuccess({
        user: loginResponse.data.user,
        token: loginResponse.data.access_token,
      }));
      
    } catch (err: any) {
      dispatch(registerFailure(err.response?.data?.message || 'Registration failed'));
    }
  };

  if (user) {
    return <Navigate to="/channels/@me" />;
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-screen bg-[#313338]">
        <div className="w-full max-w-md p-8 bg-[#1e1f22] rounded-lg shadow-xl text-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-bold mb-2 text-center text-white">Create an account</h1>
            
            {error && (
              <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              register={register}
              className="mt-4"
              placeholder="Enter your email"
            />
            
            <Input
              label="Username"
              name="username"
              register={register}
              className="mt-4"
              placeholder="Create a username"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              className="mt-4"
              placeholder="Create a password"
            />

            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-11 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Continue'}
            </button>
            
            <p className="mt-4 text-sm text-gray-400">
              <Link to="/login" className="text-[#00a8fc] hover:underline">
                Already have an account?
              </Link>
            </p>
            
            <p className="mt-4 text-[10px] text-gray-400 leading-tight">
              By registering, you agree to HustCord's Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}

export default RegisterPage;
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
