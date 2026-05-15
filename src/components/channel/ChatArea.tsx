import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import Message from './Message';
import MessageBox from './MessageBox';
import { setMessages } from '../../store/slices/messageSlice';
import api from '../../services/api';

const ChatArea: React.FC = () => {
  const { guildId, channelId } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  // Use "general" if no channel ID is in the URL yet
  const activeChannelId = channelId || 'general';
  
  const isDM = location.pathname.startsWith('/channels/@me');
  const { userId } = useParams();
  const friendName = userId === '1' ? 'Wumpus' : userId === '2' ? 'Clyde' : 'Friend';
  const guilds = useAppSelector((state) => state.guilds.list);
  const activeGuildId = guildId || useAppSelector((state) => state.ui.activeGuildId);
  const activeGuild = guilds.find((g) => g.id === activeGuildId);

  const activeChannelName = isDM 
    ? friendName 
    : activeGuild?.channels?.find((c) => c.id === activeChannelId)?.name || 'general';
  
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const messages = useAppSelector((state) => state.messages.list)
    .filter((m) => {
      if (isDM) {
        // Hiện tin nhắn nếu (mình gửi cho bạn) HOẶC (bạn gửi cho mình)
        // Sử dụng == để tránh lỗi lệch kiểu dữ liệu (String vs UUID)
        return (m.recipientId == userId && m.userId == currentUser?.id) || 
               (m.recipientId == currentUser?.id && m.userId == userId);
      }
      return m.channelId === activeChannelId;
    });
  
  const typingUsers = useAppSelector((state) => state.channels.typingUsers)
    .filter((t) => {
      // 1. Không hiện chính mình
      if (t.userId === currentUser?.id) return false;
      // 2. Lọc theo kênh hoặc DM
      return isDM ? (t.userId === userId) : t.channelId === activeChannelId;
    })
    .map((t) => {
      if (isDM && t.userId === userId) return friendName;
      return "Someone"; 
    });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tải lịch sử tin nhắn khi đổi kênh
  useEffect(() => {
    if (activeChannelId) {
      const fetchMessages = async () => {
        try {
          let response;
          if (isDM && currentUser) {
            // Tải tin nhắn 1-1: /messages/direct/nguoi_gui/nguoi_nhan
            // Ở đây userId trong useParams chính là ID của bạn bè
            response = await api.get(`/messages/direct/${currentUser.id}/${userId}`);
          } else {
            // Tải tin nhắn kênh
            response = await api.get(`/messages/channel/${activeChannelId}`);
          }

          if (Array.isArray(response.data)) {
            const mappedMessages = response.data.map((m: any) => ({
              ...m,
              content: m.text,
              authorId: m.userId,
              recipientId: m.recipientId,
              author: m.user || { username: 'Unknown' }
            }));
            dispatch(setMessages(mappedMessages));
          } else {
            console.error("API returned non-array data:", response.data);
            dispatch(setMessages([]));
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };
      fetchMessages();
    }
  }, [activeChannelId, isDM, userId, currentUser, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#313338]">
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
        {messages.map((m) => (
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
