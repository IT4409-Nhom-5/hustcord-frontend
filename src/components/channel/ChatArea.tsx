import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import Message from './Message';
import MessageBox from './MessageBox';
import type { Message as MessageType } from '../../types';
import { setMessages } from '../../store/slices/messageSlice';
import api from '../../services/api';
import UserAvatar from '../user/UserAvatar';

const ChatArea: React.FC = () => {
  const { guildId, channelId } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  
  // Use null if no channel ID is in the URL yet to avoid invalid API calls
  const activeChannelId = channelId || null;
  
  const isDM = location.pathname.startsWith('/channels/@me');
  const { userId } = useParams();
  const friends = useAppSelector((state) => state.auth.friends) || [];
  const currentFriend = friends.find((f: any) => f.id === userId);
  const friendName = currentFriend?.username || (userId === '550e8400-e29b-41d4-a716-446655440000' ? 'Wumpus' : userId === '550e8400-e29b-41d4-a716-446655440001' ? 'Clyde' : 'Friend');
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

  // Helper kiểm tra định dạng UUID
  const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Tải lịch sử tin nhắn khi đổi kênh
  useEffect(() => {
    // Chỉ fetch nếu ID là UUID hợp lệ hoặc là DM với user ID hợp lệ
    const isValidId = activeChannelId && isUUID(activeChannelId);
    const isValidDM = isDM && currentUser && userId && isUUID(userId);

    if (isValidId || isValidDM) {
      const fetchMessages = async () => {
        try {
          let response;
          if (isDM && currentUser) {
            // Tải tin nhắn 1-1
            response = await api.get(`/messages/direct/${currentUser.id}/${userId}`);
          } else if (activeChannelId) {
            // Tải tin nhắn kênh
            response = await api.get(`/messages/channel/${activeChannelId}`);
          }

          if (response && Array.isArray(response.data)) {
            const mappedMessages = response.data.map((m: any) => ({
              ...m,
              content: m.text,
              authorId: m.userId,
              recipientId: m.recipientId,
              author: m.user || { username: 'Unknown' },
              parent: m.parent ? {
                ...m.parent,
                content: m.parent.text,
                authorId: m.parent.userId,
                author: m.parent.user || { username: 'Unknown' }
              } : undefined
            }));
            dispatch(setMessages(mappedMessages));
          } else if (response) {
            console.error("API returned non-array data:", response.data);
            dispatch(setMessages([]));
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };
      fetchMessages();
    } else {
      // Nếu ID không hợp lệ, xóa danh sách tin nhắn hiện tại
      dispatch(setMessages([]));
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
          <div className="mb-4">
            {isDM ? (
              <UserAvatar user={currentFriend || { username: friendName }} size="xl" />
            ) : (
              <div className="w-[68px] h-[68px] bg-[#41434a] rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">#</span>
              </div>
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
          <Message key={m.id} message={m} onReply={setReplyingTo} />
        ))}
      </div>

      {/* Khu vực nhập tin nhắn */}
      <MessageBox 
        channelId={activeChannelId} 
        channelName={activeChannelName}
        typingUsers={typingUsers}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </main>
import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import Message from './Message';
import socketService from '../../services/socketService';

const ChatArea: React.FC = () => {
  const { messages, activeChannel } = useAppSelector((state) => state.guild);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối cùng mỗi khi danh sách tin nhắn thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && activeChannel) {
      socketService.sendMessage(activeChannel.id, inputValue.trim());
      setInputValue(''); // Xóa nội dung input sau khi gửi
    }
  };

  // Màn hình chờ khi chưa chọn kênh
  if (!activeChannel) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#80848e]">
        Vui lòng chọn một kênh để bắt đầu trò chuyện.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header của Kênh */}
      <header className="flex h-12 shrink-0 items-center border-b border-[#1e1f22] px-4 shadow-sm">
        <span className="mr-2 text-2xl font-light text-[#80848e]">#</span>
        <span className="font-bold text-white">{activeChannel.name}</span>
      </header>
      
      {/* Khu vực hiển thị danh sách tin nhắn */}
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col pb-4 mt-auto">
          {messages.length === 0 && (
            <div className="mt-4 px-4 text-[#b5bac1]">Bắt đầu cuộc trò chuyện tại đây.</div>
          )}
          {messages.map((msg) => <Message key={msg.id} message={msg} />)}
          
          {/* Element rỗng dùng để neo (scroll to bottom) */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input chat */}
      <div className="mt-auto shrink-0 px-4 pb-6 pt-2">
        <div className="flex items-center rounded-lg bg-[#383a40] p-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nhắn tin vào #${activeChannel.name}`}
            className="flex-1 bg-transparent text-[#dbdee1] placeholder-[#80848e] outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
