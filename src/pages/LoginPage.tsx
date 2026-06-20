/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import Input from '../components/ui/Input';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/slices/authSlice';
import api from '../services/api';

// Giả lập background image bằng css pattern hoặc solid color
const LoginPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  // Xóa lỗi khi vào trang
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Đây là logic login THẬT (có thể chưa chạy được ngay nếu Backend chưa cấu hình xong CORS hoàn toàn, nhưng cấu trúc thì đúng)
  const onSubmit = async (data: any) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      dispatch(loginSuccess({ 
        user: response.data.user, 
        token: response.data.access_token 
      }));
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Invalid email or password'));
    }
  };

  // Nếu đã đăng nhập, chuyển hướng sang trang chính
  if (user) {
    return <Navigate to="/channels/@me" />; 
  }

  return (
    <div className="min-h-screen bg-[#5865f2] flex items-center justify-center p-4 relative overflow-hidden bg-[url('https://discord.com/assets/c40c84ca18d84633a9d86b4046a91437.svg')] bg-cover bg-center">
      
      <div className="w-full max-w-[480px] bg-[#313338] rounded-lg shadow-2xl flex relative z-10 p-8 min-h-[400px]">
        
        {/* Cột Form Đăng Nhập */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h1 className="text-2xl font-bold mb-2 text-center md:text-left text-white">Welcome back!</h1>
            <p className="text-[#b5bac1] text-center md:text-left mb-6 text-sm">We're so excited to see you again!</p>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <Input
              label="EMAIL"
              name="email"
              register={register}
              className="mt-4"
              placeholder="Enter your email"
              required
            />
            
            <div className="mt-4 relative">
              <Input
                label="PASSWORD"
                name="password"
                type="password"
                register={register}
                placeholder="Enter your password"
                required
              />
              <a href="#" className="text-[#00a8fc] hover:underline text-xs font-medium mt-1 inline-block absolute right-0 -bottom-6">
                Forgot your password?
              </a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-11 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors mt-12 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            
            <p className="mt-4 text-sm text-[#80848e]">
              Need an account?{' '}
              <Link to="/register" className="text-[#00a8fc] hover:underline font-medium">
                Register
              </Link>
            </p>
          </form>
        </div>

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
