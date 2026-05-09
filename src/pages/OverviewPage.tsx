import React from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';

const OverviewPage: React.FC = () => {
  const { userId } = useParams();

  return (
    <PageWrapper pageTitle="HustCord | Overview" className="h-screen flex bg-[#313338] text-white">
      {/* 1. Far Left: Server Icons */}
      <Sidebar />
      
      {/* 2. Middle Left: Channel/DM List */}
      <ChannelSidebar />
      
      {/* 3. Right: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        <AppNavbar />
        
        {userId ? (
          <ChatArea />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              
              <h2 className="text-xl font-semibold text-[#f2f3f5]">No one's around to play with</h2>
              <p className="text-[#b5bac1] mt-2">Select a friend to start chatting!</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default OverviewPage;

