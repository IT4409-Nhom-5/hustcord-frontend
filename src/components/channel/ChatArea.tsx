import React from 'react';
import Message from './Message';

const ChatArea: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#313338]">
      {/* Header của Kênh */}
      <header className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm shrink-0">
        <span className="text-[#80848e] text-2xl mr-2 font-light select-none">#</span>
        <span className="font-bold text-white">general</span>
      </header>
      
      {/* Khu vực danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col justify-end">
          {/* Lời chào đầu kênh */}
          <div className="mt-4 mb-4">
            <div className="w-[68px] h-[68px] bg-[#41434a] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl text-white">#</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Chào mừng đến với #general!</h1>
            <p className="text-[#b5bac1]">Đây là điểm bắt đầu của kênh #general.</p>
          </div>

          <div className="border-t border-[#3f4147] my-4" />

          {/* Tin nhắn sử dụng Component Message thực thụ */}
          <Message 
            author="System" 
            time="Hôm nay lúc 08:00" 
            content="Kênh đã được tạo thành công. Hãy bắt đầu trò chuyện!" 
            avatarColor="bg-green-500"
          />
          <Message 
            author="Chung.DQ" 
            time="Hôm nay lúc 08:05" 
            content="Chào mọi người, dự án Frontend tiến triển tốt chứ?" 
            avatarColor="bg-indigo-500"
          />
          <Message 
            author="Cuong.P" 
            time="Hôm nay lúc 08:10" 
            content="Đang code lại layout bằng Tailwind CSS, trông mượt hơn hẳn bản cũ." 
            avatarColor="bg-red-500"
          />
      </div>

      {/* Khu vực nhập tin nhắn */}
      <div className="p-4 shrink-0">
        <div className="bg-[#383a40] rounded-lg p-2.5 flex items-center">
          <div className="w-6 h-6 bg-[#b5bac1] rounded-full mr-4 cursor-pointer hover:bg-white transition-colors flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Nhắn #general"
            className="bg-transparent flex-1 outline-none text-[#dbdee1] placeholder-[#80848e]"
          />
          <div className="flex space-x-3 ml-2">
            <span className="text-[#b5bac1] hover:text-white cursor-pointer" title="Gửi quà">🎁</span>
            <span className="text-[#b5bac1] hover:text-white cursor-pointer" title="Emoji">😀</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatArea;
