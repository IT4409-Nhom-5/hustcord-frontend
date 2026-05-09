/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';
import Message from './Message';
import MessageBox from './MessageBox';

const ChatArea: React.FC = () => {
  const { channelId } = useParams();
  
  // Use "general" if no channel ID is in the URL yet
  const activeChannelId = channelId || 'general';
  
  const isDM = location.pathname.startsWith('/channels/@me');
  const { userId } = useParams();
  const friendName = userId === '1' ? 'Wumpus' : userId === '2' ? 'Clyde' : 'Friend';
  const ui = useAppSelector((state) => state.ui);
  const guilds = useAppSelector((state) => state.guilds.list);
  const activeGuild = guilds.find((g: any) => g.id === ui.activeGuildId);

  const activeChannelName = isDM 
    ? friendName 
    : activeGuild?.channels?.find((c: any) => c.id === activeChannelId)?.name || 'general';
  
  const messages = useAppSelector((state) => state.messages.list)
    .filter((m: any) => isDM ? m.userId === userId : m.channelId === activeChannelId);
    
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const typingUsers = useAppSelector((state) => state.channels.typingUsers)
    .filter((t: any) => {
      // 1. Không hiện chính mình
      if (t.userId === currentUser?.id) return false;
      // 2. Lọc theo kênh hoặc DM
      return isDM ? (t.userId === userId) : t.channelId === activeChannelId;
    })
    .map((t: any) => {
      if (isDM && t.userId === userId) return friendName;
      return "Someone"; 
    });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#313338]">
      {/* Khu vực danh sách tin nhắn */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col justify-start">
        {/* Lời chào đầu kênh/DM */}
        <div className="mt-4 mb-4 mt-auto">
          <div className="w-[68px] h-[68px] bg-[#41434a] rounded-full flex items-center justify-center mb-4">
            {isDM ? (
              <div className="w-full h-full bg-gray-500 rounded-full"></div>
            ) : (
              <span className="text-4xl text-white">#</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isDM ? activeChannelName : `Welcome to #${activeChannelName}!`}
          </h1>
          <p className="text-[#b5bac1]">
            {isDM 
              ? `This is the beginning of your direct message history with @${activeChannelName}.`
              : `This is the start of the #${activeChannelName} channel.`}
          </p>
        </div>

        <div className="border-t border-[#3f4147] my-4" />

        {/* Render messages */}
        {messages.map((m: any) => (
          <Message key={m.id} message={m} />
        ))}
      </div>

      {/* Khu vực nhập tin nhắn */}
      <MessageBox 
        channelId={activeChannelId} 
        channelName={activeChannelName}
        typingUsers={typingUsers}
      />
    </main>
  );
};

export default ChatArea;
