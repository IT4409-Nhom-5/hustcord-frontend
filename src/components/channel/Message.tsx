import React from 'react';
import type { Message as MessageType } from '../../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  // Fallback nếu author chưa có dữ liệu (có thể avatar null)
  const avatarUrl = message.author?.avatar || 'https://cdn.discordapp.com/embed/avatars/1.png';
  const username = message.author?.username || 'Người dùng ẩn danh';
  
  // Format thời gian gửi tin nhắn
  const dateObj = new Date(message.createdAt);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = dateObj.toLocaleDateString();

  return (
    <div className="group mt-[1.0625rem] flex items-start px-4 py-1 hover:bg-[#2e3035]">
      <img src={avatarUrl} alt={username} className="mr-4 h-10 w-10 cursor-pointer rounded-full hover:shadow-md" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-baseline">
          <span className="mr-2 cursor-pointer font-medium text-white hover:underline">{username}</span>
          <span className="text-xs text-[#80848e]">{dateString} lúc {timeString}</span>
        </div>
        <div className="whitespace-pre-wrap text-[0.9375rem] leading-[1.375rem] text-[#dbdee1]">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default Message;
