import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppStore';
import SidebarIcon from './SidebarIcon';
import { openedModal } from '../../../store/slices/uiSlice';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const guilds = useAppSelector((state) => state.guilds.list);

  return (
    <div className="w-[72px] h-screen bg-[#1e1f22] flex flex-col items-center py-3 overflow-y-auto hide-scrollbar z-50 shrink-0">
      {/* Home / Direct Messages Button */}
      <SidebarIcon 
        to="/channels/@me" 
        name="Direct Messages" 
        imageURL="https://discord.com/assets/c40c84ca18d84633a9d86b4046a91437.svg" 
      />

      {/* Divider */}
      <div className="w-8 h-[2px] bg-[#313338] rounded-full mx-auto mb-2" />

      {/* Server List */}
      {guilds.map((guild: any) => (
        <SidebarIcon 
          key={guild.id}
          to={`/channels/${guild.id}`}
          name={guild.name || 'Server'}
          imageURL={guild.iconURL}
        />
      ))}

      {/* Add Server Button */}
      <SidebarIcon 
        name="Add a Server" 
        isAction={true}
        onClick={() => {
          dispatch(openedModal('CREATE_GUILD'));
        }}
      />
    </div>
  );
};

export default Sidebar;
