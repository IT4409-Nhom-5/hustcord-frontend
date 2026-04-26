import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';

// Lưu ý: CSS scoped có thể cần cấu hình plugin nếu bạn dùng Vite. 
// Nếu không, bạn có thể dùng Tailwind thuần túy.
import './RegisterPage.scoped.css';

const RegisterPage: React.FC = () => {  
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    dispatch(registerUser(data));
  };

  // Nếu đã đăng nhập, chuyển hướng sang trang chính
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
              placeholder="What should we call you?"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              className="mt-4"
              placeholder="Create a strong password"
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