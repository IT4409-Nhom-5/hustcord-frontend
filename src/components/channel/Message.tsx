import React from 'react';
import type { Message as MessageType } from '../../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="flex mt-[17px] hover:bg-[#2e3035] p-1 -mx-4 px-4 transition-colors group relative">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full flex-shrink-0 mt-0.5 cursor-pointer hover:shadow-lg transition-all overflow-hidden bg-[#5865f2] flex items-center justify-center text-white font-bold">
        {message.author?.avatar ? (
          <img src={message.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          (message.author?.username || '?').charAt(0).toUpperCase()
        )}
      </div>
      
      {/* Nội dung tin nhắn */}
      <div className="ml-4 flex-1">
        <div className="flex items-baseline">
          <span className="font-medium text-white mr-2 hover:underline cursor-pointer">
            {message.author?.username || 'Unknown User'}
          </span>
          <span className="text-[11px] font-medium text-[#80848e]">
            {time}
          </span>
        </div>
        <div className="text-[#dbdee1] mt-0.5 leading-normal whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>

      {/* Toolbar xuất hiện khi hover */}
      <div className="absolute -top-4 right-4 hidden group-hover:flex bg-[#313338] border border-[#232428] rounded-md shadow-lg overflow-hidden h-8 items-center px-1 space-x-1 z-10">
        <button className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-[#dbdee1] rounded transition-colors" title="Add Reaction">
          😀
        </button>
        <button className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-[#dbdee1] rounded transition-colors" title="Edit">
          ✏️
        </button>
        <button className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-[#dbdee1] rounded transition-colors" title="More">
          💬
        </button>
        <button className="p-1.5 hover:bg-[#3f4147] text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Message;
