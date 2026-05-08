import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#404eed] font-sans text-white">
      {/* Thanh điều hướng (Navbar) */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-wide">
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.67,77.67,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,96.11,53,91.08,65.69,84.69,65.69Z" />
          </svg>
          HustCord
        </div>
        
        <div className="space-x-4">
          <Link
            to="/login"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#23272a] transition-all hover:text-[#5865F2] hover:shadow-lg"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* Khu vực nội dung chính (Hero Section) */}
      <main className="flex flex-1 items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-8 font-sans text-4xl font-extrabold uppercase tracking-tight sm:text-5xl md:text-7xl">
            Tưởng tượng một nơi...
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-base font-light leading-relaxed sm:text-lg md:text-xl">
            ...nơi bạn có thể thuộc về một câu lạc bộ trường học, một nhóm game thủ, hoặc một cộng đồng nghệ thuật toàn thế giới. Nơi chỉ có bạn và một nhóm bạn thân dành thời gian bên nhau. Một nơi giúp bạn dễ dàng trò chuyện mỗi ngày và gặp gỡ thường xuyên hơn.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-[#23272a] transition-all hover:text-[#5865F2] hover:shadow-xl sm:w-auto"
            >
              Mở HustCord trên trình duyệt
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
