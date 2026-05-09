/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppStore';
import { Link, useLocation } from 'react-router-dom';
import SidebarFooter from './SidebarFooter';
import { openedModal } from '../../../store/slices/uiSlice';

const SidebarContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isMePage = location.pathname.startsWith('/channels/@me');
  const ui = useAppSelector((state) => state.ui);
  const guilds = useAppSelector((state) => state.guilds.list);
  
  const activeGuild = guilds.find((g: any) => g.id === ui.activeGuildId);
  
  // Fake data for UI preview since we don't have DMs/Channels state fully mapped yet
  const dmList = [
    { id: '1', name: 'Wumpus', status: 'online' },
    { id: '2', name: 'Clyde', status: 'idle' },
  ];

  const channels = activeGuild?.channels || [
    { id: 'general', name: 'general' },
    { id: 'voice', name: 'General Voice' },
  ];

  return (
    <div className="w-[240px] bg-[#2b2d31] flex flex-col h-screen shrink-0">
      {/* Header */}
      <div className="h-12 flex items-center px-4 shadow-[0_1px_2px_rgba(0,0,0,0.2)] shrink-0 hover:bg-[#3f4147] cursor-pointer transition-colors">
        <span className="font-semibold text-white truncate w-full">
          {isMePage ? 'Start a conversation' : (activeGuild?.name || 'HustCord Server')}
        </span>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pt-2 px-2">
        {isMePage ? (
          // DM List
          <div className="flex flex-col gap-0.5">
            <Link to="/channels/@me" className="flex items-center px-2 py-2 rounded bg-[#3f4147] text-white cursor-pointer group">
              <svg className="w-6 h-6 mr-3 text-[#dbdee1] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 11a1 1 0 0 1-2 0c0-2.33-2.33-4-5-4H10c-2.67 0-5 1.67-5 4a1 1 0 1 1-2 0c0-3.33 3.33-6 7-6h4c3.67 0 7 2.67 7 6Z"/></svg>
              <span className="font-medium">Friends</span>
            </Link>
            <div className="mt-4 mb-1 pl-2 text-xs font-semibold text-[#b5bac1] uppercase hover:text-[#dbdee1] cursor-pointer flex justify-between group">
              <span>Direct Messages</span>
              <span className="pr-1 opacity-0 group-hover:opacity-100">+</span>
            </div>
            {dmList.map(dm => (
              <Link 
                key={dm.id} 
                to={`/channels/@me/${dm.id}`}
                className={`flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group ${location.pathname === `/channels/@me/${dm.id}` ? 'bg-[#3f4147] text-white' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-500 mr-3 relative shrink-0">
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#2b2d31] rounded-full group-hover:border-[#35373c] ${dm.status === 'online' ? 'bg-[#23a559]' : 'bg-[#f0b232]'}`}></div>
                </div>
                <span className="font-medium truncate">{dm.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          // Channel List
          <div className="flex flex-col gap-0.5">
            <div className="mt-4 mb-1 pl-2 text-xs font-semibold text-[#b5bac1] uppercase hover:text-[#dbdee1] cursor-default flex justify-between group">
              <span>Text Channels</span>
              <span 
                onClick={() => dispatch(openedModal('CREATE_CHANNEL'))}
                className="pr-2 opacity-0 group-hover:opacity-100 cursor-pointer text-xl leading-none"
              >
                +
              </span>
            </div>
            {channels.map((channel: any) => (
              <Link 
                key={channel.id} 
                to={`/channels/${activeGuild?.id}/${channel.id}`}
                className="flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdee1] cursor-pointer"
              >
                <svg className="w-5 h-5 mr-1.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.82 10l-.67 4H9.18l.67-4h4.97Z"/></svg>
                <span className="font-medium truncate">{channel.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <SidebarFooter />
    </div>
  );
};

export default SidebarContent;
