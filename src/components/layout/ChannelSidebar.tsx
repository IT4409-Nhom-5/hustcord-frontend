import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { joinVoiceChannel, openedModal } from '../../store/slices/uiSlice';
import VoiceControlPanel from '../navigation/sidebar/VoiceControlPanel';

interface ChannelItemProps {
  id: string;
  name: string;
  active?: boolean;
  type?: 'text' | 'voice';
  to?: string;
  onClick?: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ name, active, type = 'text', to, onClick }) => {
  const content = (
    <div 
      onClick={onClick}
      className={`
        flex items-center px-2 py-1.5 mb-[2px] rounded-md cursor-pointer group transition-colors
        ${active ? 'bg-[#3f4147] text-white' : 'text-[#80848e] hover:bg-[#35373c] hover:text-[#dbdee1]'}
      `}
    >
      <span className="text-xl text-[#80848e] mr-1.5 font-light select-none group-hover:text-[#dbdee1]">
        {type === 'text' ? '#' : (
          <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
        )}
      </span>
      <span className="font-medium truncate">{name}</span>
    </div>
  );

  if (to) return <Link to={to} className="no-underline">{content}</Link>;
  return content;
};

const UserPanel: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  
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
          <div className="text-[#b5bac1] group-hover:text-[#dbdee1] truncate">Online</div>
        </div>
      </div>
      
      <div className="flex text-[#b5bac1] shrink-0 ml-2">
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer" title="Mute">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer" title="Deafen">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10v7a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5v-2a7 7 0 0 1 14 0v2h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-7a10 10 0 0 0-10-10Z"/></svg>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] cursor-pointer" title="User Settings">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58ZM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6Z"/></svg>
        </div>
      </div>
    </section>
  );
};

const ChannelSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ui = useAppSelector((state) => state.ui);
  const guilds = useAppSelector((state) => state.guilds.list);
  
  const isMePage = location.pathname.startsWith('/channels/@me');
  const activeVoiceChannel = ui.activeVoiceChannel;
  
  // Tìm kiếm Guild hiện tại từ danh sách chung để đảm bảo dữ liệu luôn mới nhất
  const activeGuild = guilds.find((g: any) => g.id === ui.activeGuildId);

  // Lọc danh sách kênh từ Guild tìm được
  const textChannels = activeGuild?.channels?.filter((c: any) => c.type === 'text' || !c.type) || [];
  const voiceChannels = activeGuild?.channels?.filter((c: any) => c.type === 'voice') || [];

  const navigate = useNavigate();

  const handleJoinVoice = (id: string, name: string) => {
    // 1. Kết nối âm thanh
    dispatch(joinVoiceChannel({ id, name, guildId: ui.activeGuildId || 'hust-server' }));
    // 2. Chuyển hướng giao diện chính vào phòng gọi
    navigate(`/channels/${ui.activeGuildId}/${id}`);
  };

  return (
    <aside className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm font-bold text-white hover:bg-[#3f4147] cursor-pointer transition-colors shrink-0">
        <span className="truncate">
          {isMePage ? 'Start a conversation' : (activeGuild?.name || 'HustCord Server')}
        </span>
      </div>
      
      {/* Content List */}
      <div className="flex-1 overflow-y-auto pt-3 px-2 custom-scrollbar">
        {isMePage ? (
          <div className="flex flex-col gap-0.5">
            <Link to="/channels/@me" className={`flex items-center px-2 py-2 rounded mb-4 cursor-pointer group ${location.pathname === '/channels/@me' ? 'bg-[#3f4147] text-white' : 'text-[#80848e] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}>
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 11a1 1 0 0 1-2 0c0-2.33-2.33-4-5-4H10c-2.67 0-5 1.67-5 4a1 1 0 1 1-2 0c0-3.33 3.33-6 7-6h4c3.67 0 7 2.67 7 6Z"/></svg>
              <span className="font-medium">Friends</span>
            </Link>
            
            <div className="mb-1 pl-2 text-xs font-semibold text-[#80848e] uppercase select-none">Direct Messages</div>
            {/* Fake DMs for preview */}
            {[
              { id: '1', name: 'Wumpus', status: 'online' },
              { id: '2', name: 'Clyde', status: 'idle' },
            ].map(dm => (
              <Link 
                key={dm.id} 
                to={`/channels/@me/${dm.id}`}
                className={`flex items-center px-2 py-1.5 rounded hover:bg-[#35373c] text-[#80848e] hover:text-[#dbdee1] cursor-pointer group ${location.pathname === `/channels/@me/${dm.id}` ? 'bg-[#3f4147] text-white' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-500 mr-3 relative shrink-0">
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#2b2d31] rounded-full group-hover:border-[#35373c] ${dm.status === 'online' ? 'bg-[#23a559]' : 'bg-[#f0b232]'}`}></div>
                </div>
                <span className="font-medium truncate">{dm.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {/* Render Text Channels */}
            {textChannels.length > 0 && (
              <>
                <div className="flex items-center px-1 mb-1 text-[#80848e] hover:text-[#dbdee1] cursor-default">
                  <span className="text-[11px] font-bold uppercase tracking-wider select-none">Text Channels</span>
                </div>
                {textChannels.map((ch: any) => (
                  <ChannelItem 
                    key={ch.id} 
                    id={ch.id} 
                    name={ch.name} 
                    type="text"
                    to={`/channels/${ui.activeGuildId}/${ch.id}`}
                    active={location.pathname.includes(ch.id)} 
                  />
                ))}
              </>
            )}
            
            {/* Render Voice Channels */}
            <div className="mt-4">
              <div className="flex items-center justify-between px-1 mb-1 text-[#80848e] hover:text-[#dbdee1] cursor-pointer group">
                <span className="text-[11px] font-bold uppercase tracking-wider select-none">Voice Channels</span>
                <span 
                  onClick={(e) => { e.stopPropagation(); dispatch(openedModal('CREATE_CHANNEL')); }}
                  className="text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >+</span>
              </div>
              {voiceChannels.length > 0 ? voiceChannels.map((ch: any) => (
                <ChannelItem 
                  key={ch.id}
                  id={ch.id}
                  name={ch.name} 
                  type="voice" 
                  active={activeVoiceChannel?.id === ch.id}
                  onClick={() => handleJoinVoice(ch.id, ch.name)} 
                />
              )) : (
                <div className="px-2 py-1 text-xs text-[#80848e] italic">No voice channels</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Voice Connection Status */}
      <VoiceControlPanel />

      {/* Thông tin người dùng hiện tại */}
      <UserPanel />
    </aside>
  );
};

export default ChannelSidebar;
