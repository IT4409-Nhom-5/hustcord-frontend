import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppStore';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';
import VoiceCallArea from '../components/channel/VoiceCallArea';
import MemberList from '../components/navigation/sidebar/MemberList';

const GuildPage: React.FC = () => {
  const { channelId } = useParams();
  const ui = useAppSelector((state) => state.ui);
  const guilds = useAppSelector((state) => state.guilds.list);
  
  // Tìm channel hiện tại để biết type (text hay voice)
  const activeGuild = guilds.find(g => g.id === ui.activeGuildId);
  const activeChannel = activeGuild?.channels?.find(c => c.id === channelId);
  const isVoiceChannel = activeChannel?.type === 'VOICE';

  return (
    <PageWrapper pageTitle="HustCord | Server" className="h-screen flex bg-[#313338] text-white">
      {/* 1. Far Left: Server Icons */}
      <Sidebar />
      
      {/* 2. Middle Left: Channel List */}
      <ChannelSidebar />
      
      {/* 3. Right: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 min-h-0">
        <AppNavbar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content: Chat or Voice Call */}
          {isVoiceChannel ? (
            <VoiceCallArea />
          ) : (
            <>
              <ChatArea />
              <MemberList />
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default GuildPage;
