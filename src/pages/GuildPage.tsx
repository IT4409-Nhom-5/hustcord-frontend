import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { setActiveGuild } from '../store/slices/guildSlice';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import ChannelSidebar from '../components/layout/ChannelSidebar';
import AppNavbar from '../components/navigation/AppNavbar';
import ChatArea from '../components/channel/ChatArea';
import VoiceCallArea from '../components/channel/VoiceCallArea';
import MemberList from '../components/navigation/sidebar/MemberList';
import { setSidebarOpen, setMemberListOpen } from '../store/slices/uiSlice';

const GuildPage: React.FC = () => {
  const { guildId, channelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: guilds, loaded } = useAppSelector((state) => state.guilds);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const isMemberListOpen = useAppSelector((state) => state.ui.isMemberListOpen);
  
  const activeGuild = guilds.find(g => g.id === guildId);

  // Cập nhật guild đang hoạt động vào store khi URL thay đổi
  useEffect(() => {
    if (guildId) {
      dispatch(setActiveGuild(guildId));
    }
  }, [guildId, dispatch]);

  // Chuyển hướng về trang chủ tin nhắn nếu Server không tồn tại trong danh sách (sau khi đã tải xong)
  useEffect(() => {
    if (loaded && guildId) {
      const activeGuildExists = guilds.some(g => g.id === guildId);
      if (!activeGuildExists) {
        navigate('/channels/@me', { replace: true });
      }
    }
  }, [loaded, guildId, guilds, navigate]);

  // Redirect to first channel if none is selected, or ID is invalid, or channel is not found in activeGuild's channels
  useEffect(() => {
    const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const isChannelNotFound = activeGuild && channelId && isUUID(channelId) && !activeGuild.channels?.some(c => c.id === channelId);
    const isInvalidChannel = !channelId || !isUUID(channelId) || isChannelNotFound;

    if (activeGuild && isInvalidChannel && activeGuild.channels && activeGuild.channels.length > 0) {
      // Tìm channel text đầu tiên hoặc channel bất kỳ
      const firstChannel = activeGuild.channels.find(c => c.type === 'TEXT') || activeGuild.channels[0];
      if (firstChannel && isUUID(firstChannel.id)) {
        navigate(`/channels/${guildId}/${firstChannel.id}`, { replace: true });
      }
    }
  }, [activeGuild, channelId, guildId, navigate]);

  // Tìm channel hiện tại để biết type (text hay voice)
  const activeChannel = activeGuild?.channels?.find(c => c.id === channelId);
  const isVoiceChannel = activeChannel?.type === 'VOICE';

  return (
    <PageWrapper pageTitle="HustCord | Server" className="h-screen flex bg-[#313338] text-white relative">
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

      {/* Backdrop overlay for left sidebar on mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}
      
      {/* 3. Right: Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0 min-h-0">
        <AppNavbar />
        
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Content: Chat or Voice Call */}
          {isVoiceChannel ? (
            <VoiceCallArea />
          ) : (
            <>
              <ChatArea />
              {/* Member list container for mobile slide-out and desktop flow */}
              <div className={`
                shrink-0 z-40 transition-transform duration-300 ease-in-out
                md:block md:relative md:translate-x-0
                fixed top-0 right-0 h-full
                ${isMemberListOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
              `}>
                <MemberList />
              </div>

              {/* Backdrop overlay for member list on mobile */}
              {isMemberListOpen && (
                <div 
                  onClick={() => dispatch(setMemberListOpen(false))}
                  className="fixed inset-0 bg-black/60 z-30 md:hidden"
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default GuildPage;
