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