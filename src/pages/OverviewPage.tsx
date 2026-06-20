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
  );
};

export default OverviewPage;

