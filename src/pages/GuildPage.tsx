import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import SidebarContent from '../components/navigation/sidebar/SidebarContent';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';
import MemberList from '../components/navigation/sidebar/MemberList';

const GuildPage: React.FC = () => {
  return (
    <PageWrapper pageTitle="HustCord | Server" className="h-screen flex bg-[#313338] text-white">
      {/* 1. Far Left: Server Icons */}
      <Sidebar />
      
      {/* 2. Middle Left: Channel List */}
      <SidebarContent />
      
      {/* 3. Right: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        <AppNavbar />
        
        <div className="flex-1 flex">
          {/* Main Chat Window */}
          <ChatArea />
          
          {/* Member List */}
          <MemberList />
        </div>
      </div>
    </PageWrapper>
  );
};

export default GuildPage;
