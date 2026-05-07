import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';
import Input from '../components/ui/Input';
import axios from 'axios';

// Giả lập background image bằng css pattern hoặc solid color
const LoginPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);
  
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm();

  // Đây là logic login THẬT (có thể chưa chạy được ngay nếu Backend chưa cấu hình xong CORS hoàn toàn, nhưng cấu trúc thì đúng)
  const onSubmit = async (data: any) => {
    dispatch(loginStart());
    try {
      // Giả lập call API, sau này thay bằng: 
      // const response = await axios.post('http://localhost:3000/auth/login', data);
      
      // Tạm thời giả lập thành công để test UI
      setTimeout(() => {
        if(data.email && data.password) {
            dispatch(loginSuccess({ 
                user: { username: data.email.split('@')[0], email: data.email }, 
                token: 'fake-jwt-token' 
            }));
        } else {
            dispatch(loginFailure('Invalid email or password'));
        }
      }, 1000);
      
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  // Nếu đã đăng nhập, chuyển hướng sang trang chính
  if (user) {
    return <Navigate to="/channels/1/1" />; // Chuyển tạm vào kênh 1/1
  }

  return (
    <div className="min-h-screen bg-[#5865f2] flex items-center justify-center p-4 relative overflow-hidden bg-[url('https://discord.com/assets/c40c84ca18d84633a9d86b4046a91437.svg')] bg-cover bg-center">
      
      <div className="w-full max-w-[784px] bg-[#313338] rounded-lg shadow-2xl flex relative z-10 p-8 min-h-[400px]">
        
        {/* Cột Form Đăng Nhập */}
        <div className="flex-1 pr-0 md:pr-8">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <h1 className="text-2xl font-bold mb-2 text-center md:text-left text-white">Welcome back!</h1>
            <p className="text-[#b5bac1] text-center md:text-left mb-6 text-sm">We're so excited to see you again!</p>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <Input
              label="EMAIL OR PHONE NUMBER"
              name="email"
              register={register}
              className="mt-4"
              required
            />
            
            <div className="mt-4 relative">
              <Input
                label="PASSWORD"
                name="password"
                type="password"
                register={register}
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

        {/* Cột QR Code (Chỉ hiện trên Desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center w-[240px] border-l border-[#3f4147] pl-8">
          <div className="w-44 h-44 bg-white rounded flex items-center justify-center p-2 mb-6">
            {/* Fake QR Code */}
            <div className="w-full h-full bg-[#313338] relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center">
                 <div className="w-10 h-10 bg-[#5865f2] rounded-full"></div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">Log in with QR Code</h2>
          <p className="text-[#b5bac1] text-sm text-center">
            Scan this with the <strong>Discord mobile app</strong> to log in instantly.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
