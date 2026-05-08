import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { logout } from '../store/slices/authSlice';

const OverviewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  // Lấy thông tin user để hiển thị tên
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    // Gọi action logout, Redux sẽ tự clear token và update state
    dispatch(logout());
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#313338] text-[#dbdee1]">
      <div className="flex flex-col items-center rounded-lg bg-[#2b2d31] p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-white">Trang Tổng Quan (@me)</h1>
        <p className="mb-2">
          Chào mừng <span className="font-semibold text-white">{user?.username || 'Bạn'}</span> đã quay trở lại!
        </p>
        <p className="mb-8 text-sm text-[#80848e]">Khu vực này sau này sẽ hiển thị Danh sách bạn bè và Tin nhắn trực tiếp (DM).</p>
        
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default OverviewPage;
