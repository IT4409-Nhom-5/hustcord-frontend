import React from 'react';
import ServerSidebar from './ServerSidebar';
import ChannelSidebar from './ChannelSidebar';
import WSListener from '../WSListener';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#313338] font-sans text-[#dbdee1]">
      
      {/* Khởi chạy trình lắng nghe WebSocket ẩn */}
      <WSListener />

      {/* CỘT 1: Danh sách Servers (Guilds) */}
      <ServerSidebar />

      {/* CỘT 2: Danh sách Channels & Thông tin cá nhân */}
      <ChannelSidebar />

      {/* CỘT 3: Khu vực Nội dung chính (Chat Area / Overview) */}
      <main className="flex min-w-0 flex-1 flex-col bg-[#313338]">
        {children}
      </main>

    </div>
  );
};

export default PageWrapper;
