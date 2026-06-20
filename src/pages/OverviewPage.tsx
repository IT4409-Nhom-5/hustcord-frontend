import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';
import FriendsDashboard from '../components/user/FriendsDashboard';
import { useAppSelector, useAppDispatch } from '../hooks/useAppStore';
import { setSidebarOpen } from '../store/slices/uiSlice';

const OverviewPage: React.FC = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'blocked' | 'add_friend'>('all');
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <PageWrapper pageTitle="HustCord | Overview" className="h-screen flex bg-[#313338] text-white relative">
      {/* Combined sidebars container for mobile slide-out and desktop flow */}
      <div className={`
        flex shrink-0 z-40 transition-transform duration-300 ease-in-out
        md:flex md:relative md:translate-x-0
        fixed top-0 left-0 h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar />
        <ChannelSidebar />
      </div>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}
      
      {/* 3. Right: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 min-h-0">
        <AppNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {userId ? (
          <ChatArea />
        ) : (
          <FriendsDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </PageWrapper>
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

