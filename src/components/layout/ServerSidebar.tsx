import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { setActiveGuild } from '../../store/slices/guildSlice';

const ServerSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { guilds, activeGuild } = useAppSelector((state) => state.guild);

  return (
    <nav className="flex w-[72px] flex-shrink-0 flex-col items-center space-y-2 bg-[#1e1f22] py-3 custom-scrollbar overflow-y-auto">
      {/* Nút Home/Direct Messages */}
      <div className="group relative flex items-center">
        <div className="absolute -left-3 h-10 w-2 rounded-r-lg bg-white transition-all duration-200" />
        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[16px] bg-[#5865f2] font-medium text-white transition-all duration-200">
          H
        </div>
      </div>
      
      <div className="mx-auto h-[2px] w-8 rounded-lg bg-[#35363c]" />

      {/* Render danh sách Server từ Redux */}
      {guilds.map((guild) => (
        <div 
          key={guild.id} 
          className="group relative flex items-center"
          onClick={() => dispatch(setActiveGuild(guild))}
        >
          <div className={`absolute -left-3 w-2 rounded-r-lg bg-white transition-all duration-200 ${activeGuild?.id === guild.id ? 'h-10' : 'h-2 opacity-0 group-hover:h-5 group-hover:opacity-100'}`} />
          <div className={`flex h-12 w-12 cursor-pointer items-center justify-center transition-all duration-200 font-medium ${activeGuild?.id === guild.id ? 'rounded-[16px] bg-[#5865f2] text-white' : 'rounded-[30px] bg-[#313338] text-[#dbdee1] hover:rounded-[16px] hover:bg-[#5865f2] hover:text-white'}`}>
            {guild.name.charAt(0)}
          </div>
        </div>
      ))}

      {/* Nút thêm Server */}
      <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[30px] bg-[#313338] text-2xl font-light text-[#23a55a] transition-all duration-200 hover:rounded-[16px] hover:bg-[#23a55a] hover:text-white">
        +
      </div>
    </nav>
  );
};

export default ServerSidebar;
