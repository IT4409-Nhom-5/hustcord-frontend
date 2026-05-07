import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ServerSidebar from '../components/layout/ServerSidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import ChatArea from '../components/channel/ChatArea';

const GuildPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex h-screen w-full bg-[#313338] text-[#dbdee1] overflow-hidden font-sans">
        
        {/* 1. Server List*/}
        <ServerSidebar />

        {/* 2. Navigation Sidebar */}
        <ChannelSidebar />

        {/* 3. Chat Window */}
        <ChatArea />

        {/* 4. MemberList */}

      </div>
    </PageWrapper>
  );
};

export default GuildPage;
