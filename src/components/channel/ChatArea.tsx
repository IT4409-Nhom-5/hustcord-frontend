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
