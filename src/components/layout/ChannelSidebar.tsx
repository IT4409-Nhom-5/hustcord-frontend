import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ChannelItemProps {
  name: string;
  active?: boolean;
  type?: 'text' | 'voice';
}

interface CategoryProps {
  title: string;
}

const ChannelCategory: React.FC<CategoryProps> = ({ title }) => (
  <div className="flex items-center px-1 mb-1 mt-4 first:mt-0 text-[#80848e] hover:text-[#dbdee1] cursor-pointer">
    <span className="text-[11px] font-bold uppercase tracking-wider select-none">{title}</span>
  </div>
);

const ChannelItem: React.FC<ChannelItemProps> = ({ name, active, type = 'text' }) => (
  <div className={`
    flex items-center px-2 py-1.5 mb-[2px] rounded-md cursor-pointer group transition-colors
    ${active ? 'bg-[#3f4147] text-white' : 'text-[#80848e] hover:bg-[#35373c] hover:text-[#dbdee1]'}
  `}>
    <span className="text-xl text-[#80848e] mr-1.5 font-light select-none">
      {type === 'text' ? '#' : '🔊'}
    </span>
    <span className="font-medium truncate">{name}</span>
  </div>
);

const UserPanel: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return (
    <section className="h-[52px] bg-[#232428] px-2 flex items-center justify-between shrink-0">
      <div className="flex items-center hover:bg-[#3f4147] p-1 rounded-md cursor-pointer transition-colors group flex-1 min-w-0">
        <div className="relative shrink-0">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] border-[3px] border-[#232428] rounded-full" />
        </div>
        <div className="ml-2 text-xs flex-1 min-w-0">
          <div className="font-bold text-white leading-tight truncate">
            {user?.username || 'Guest'}
          </div>
          <div className="text-[#b5bac1] group-hover:text-[#dbdee1] truncate">Trực tuyến</div>
        </div>
      </div>
      
      {/* Các nút điều khiển giả lập */}
      <div className="flex text-[#b5bac1] shrink-0 ml-2">
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer">
          🎤
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer">
          🎧
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer">
          ⚙️
        </div>
      </div>
    </section>
  );
};

const ChannelSidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0">
      {/* Tên Server */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm font-bold text-white hover:bg-[#35373c] cursor-pointer transition-colors shrink-0">
        HUST - Computer Eng
      </div>
      
      {/* Danh sách Channel */}
      <div className="flex-1 overflow-y-auto pt-3 px-2 custom-scrollbar">
        <ChannelCategory title="Kênh văn bản" />
        <ChannelItem name="general" active />
        <ChannelItem name="thông-báo" />
        <ChannelItem name="tài-liệu-hust" />
        
        <ChannelCategory title="Kênh thoại" />
        <ChannelItem name="Phòng chờ" type="voice" />
        <ChannelItem name="Học nhóm" type="voice" />
      </div>

      {/* Thông tin người dùng hiện tại */}
      <UserPanel />
    </aside>
  );
};

export default ChannelSidebar;
