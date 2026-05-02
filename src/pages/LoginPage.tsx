import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';

const LoginPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const loading = useSelector((state: RootState) => state.auth.loading);
    const error = useSelector((state: RootState) => state.auth.error);
    
    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit } = useForm();
    
    const onSubmit = (data: any) => {
        dispatch(loginUser(data));
    };
    // Nếu đã đăng nhập, chuyển hướng sang trang chính
    if (user) {
        return <Navigate to="/channels/@me" />;
    }
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white">
        <div className="w-full max-w-md p-8 bg-[#1e1f22] rounded-lg shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-bold mb-2 text-center">Welcome back!</h1>
            <p className="text-gray-400 text-center mb-6">We're so excited to see you again!</p>
            
              {error && (
                <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm text-center">
                  {error}
                </div>
              )}
              
              <Input
                label="Username"
                name="username"
                register={register}
                className="mt-4"
                placeholder="Enter your username"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                register={register}
                className="mt-4"
                placeholder="Enter your password"
              />
              <button 
                type="submit" 
                className={`w-full h-11 bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium rounded transition-colors mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? 'Logging in...' : 'Log In'}
              </button>

              
                <Link 
                  to="/register" 
                  className="block text-center text-[#00a8fc] hover:underline text-sm"
                >
                  Need an account? Register
                </Link>
                <Link 
                  to="/" 
                  className="block text-center text-gray-500 hover:text-gray-300 text-xs mt-4"
                >
                  Back to Home
                </Link>
            </form>
          
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
