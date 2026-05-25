import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';
import FriendsDashboard from '../components/user/FriendsDashboard';

const OverviewPage: React.FC = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'blocked' | 'add_friend'>('all');

  return (
    <PageWrapper pageTitle="HustCord | Overview" className="h-screen flex bg-[#313338] text-white">
      {/* 1. Far Left: Server Icons */}
      <Sidebar />
      
      {/* 2. Middle Left: Channel/DM List */}
      <ChannelSidebar />
      
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

