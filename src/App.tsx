import React from 'react';

// --- Định nghĩa Types ---
interface ServerIconProps {
  active?: boolean;
  isGreen?: boolean;
  label?: string;
}

interface ChannelItemProps {
  name: string;
  active?: boolean;
}

interface CategoryProps {
  title: string;
}

// --- Main Component ---
const DiscordClone: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#313338] text-[#dbdee1] overflow-hidden font-sans">
      
      {/* 1. Server List */}
      <nav className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 flex-shrink-0">
        <ServerIcon active label="H" />
        <div className="w-8 h-[2px] bg-[#35363c] rounded-lg mx-auto" />
        <ServerIcon label="CS" />
        <ServerIcon label="LO" />
        <ServerIcon isGreen label="+" />
      </nav>

      {/* 2. Navigation Sidebar */}
      <aside className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0">
        <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm font-bold text-white hover:bg-[#35373c] cursor-pointer transition-colors">
          HUST - Computer Eng
        </div>
        
        <div className="flex-1 overflow-y-auto pt-3 px-2 custom-scrollbar">
          <ChannelCategory title="Kênh văn bản" />
          <ChannelItem name="general" active />
          <ChannelItem name="thông-báo" />
          <ChannelItem name="tài-liệu-hust" />
          
          <div className="mt-4">
            <ChannelCategory title="Kênh thoại" />
            <ChannelItem name="Phòng chờ" />
            <ChannelItem name="Học nhóm" />
          </div>
        </div>

        {/* User Control Panel */}
        <section className="h-[52px] bg-[#232428] px-2 flex items-center justify-between">
          <div className="flex items-center hover:bg-[#3f4147] p-1 rounded-md cursor-pointer transition-colors group">
            <div className="relative">
                <div className="w-8 h-8 bg-indigo-500 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] border-[3px] border-[#232428] rounded-full" />
            </div>
            <div className="ml-2 text-xs">
              <div className="font-bold text-white leading-tight">Chung.DQ</div>
              <div className="text-[#b5bac1] group-hover:text-[#dbdee1]">Trực tuyến</div>
            </div>
          </div>
        </section>
      </aside>

      {/* 3. Chat Window */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        <header className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm">
          <span className="text-[#80848e] text-2xl mr-2 font-light">#</span>
          <span className="font-bold text-white">general</span>
        </header>
        
        <div className="flex-1 p-4">
            <div className="text-[#b5bac1]">Bắt đầu cuộc trò chuyện tại đây.</div>
        </div>
      </main>

    </div>
  );
};

// --- Sub-components với Type Safety ---

const ServerIcon: React.FC<ServerIconProps> = ({ active, isGreen, label }) => (
  <div className="relative group flex items-center">
    <div className={`absolute -left-3 w-2 bg-white rounded-r-lg transition-all duration-200 
      ${active ? 'h-10' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'}`} 
    />
    <div className={`
      w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 font-medium
      ${active ? 'rounded-[16px] bg-[#5865f2] text-white' : 
        isGreen ? 'rounded-[30px] bg-[#313338] text-[#23a55a] hover:rounded-[16px] hover:bg-[#23a55a] hover:text-white' :
        'rounded-[30px] bg-[#313338] text-[#dbdee1] hover:rounded-[16px] hover:bg-[#5865f2] hover:text-white'}
    `}>
      {label}
    </div>
  </div>
);

const ChannelCategory: React.FC<CategoryProps> = ({ title }) => (
  <div className="flex items-center px-1 mb-1 text-[#80848e] hover:text-[#dbdee1] cursor-pointer">
    <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
  </div>
);

const ChannelItem: React.FC<ChannelItemProps> = ({ name, active }) => (
  <div className={`
    flex items-center px-2 py-1.5 mb-[2px] rounded-md cursor-pointer group transition-colors
    ${active ? 'bg-[#3f4147] text-white' : 'text-[#80848e] hover:bg-[#35373c] hover:text-[#dbdee1]'}
  `}>
    <span className="text-xl text-[#80848e] mr-1.5 font-light">#</span>
    <span className="font-medium">{name}</span>
  </div>
);

export default DiscordClone;