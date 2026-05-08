import React from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import Category from '../ui/Category';

const ChannelSidebar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { activeGuild } = useAppSelector((state) => state.guild);

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col bg-[#2b2d31]">
      {/* Header của Server */}
      <div className="flex h-12 cursor-pointer items-center border-b border-[#1e1f22] px-4 font-bold text-white shadow-sm transition-colors hover:bg-[#35373c]">
        {activeGuild ? activeGuild.name : 'Chưa chọn Server'}
      </div>
      
      {/* Danh sách Channel */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pt-3">
        <Category title="Kênh văn bản" />
        {/* Dummy Channel Item (Sau này sẽ map từ activeGuild.channels) */}
        <div className="group mb-[2px] flex cursor-pointer items-center rounded-md px-2 py-1.5 transition-colors bg-[#3f4147] text-white">
          <span className="mr-1.5 text-xl font-light text-[#80848e]">#</span>
          <span className="font-medium">general</span>
        </div>
      </div>

      {/* Bảng điều khiển User */}
      <section className="flex h-[52px] items-center justify-between bg-[#232428] px-2 mt-auto">
        <div className="group flex cursor-pointer items-center rounded-md p-1 transition-colors hover:bg-[#3f4147]">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-indigo-500" />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-[3px] border-[#232428] bg-[#23a55a]" />
          </div>
          <div className="ml-2 text-xs">
            <div className="font-bold leading-tight text-white">{user?.username || 'User'}</div>
            <div className="text-[#b5bac1] group-hover:text-[#dbdee1]">Trực tuyến</div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default ChannelSidebar;
