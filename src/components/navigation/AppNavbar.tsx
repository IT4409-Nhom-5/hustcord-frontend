import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { startCall, toggleSidebar, toggleMemberList } from '../../store/slices/uiSlice';
import UserAvatar from '../user/UserAvatar';

interface AppNavbarProps {
  activeTab?: 'all' | 'pending' | 'blocked' | 'add_friend';
  setActiveTab?: (tab: 'all' | 'pending' | 'blocked' | 'add_friend') => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ activeTab = 'all', setActiveTab }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const friends = useAppSelector((state) => state.auth.friends) || [];
  const isMemberListOpen = useAppSelector((state) => state.ui.isMemberListOpen);
  
  // Lấy userId trực tiếp từ pathname (vd: /channels/@me/1 -> userId = 1)
  const pathParts = location.pathname.split('/');
  const isMePage = pathParts[1] === 'channels' && pathParts[2] === '@me';
  const userIdFromPath = pathParts[3]; 
  
  const isDM = isMePage && userIdFromPath;

  // Lấy thông tin bạn bè thật từ store
  const currentFriend = friends.find((f: any) => f.id === userIdFromPath);
  const friendName = currentFriend?.username || (userIdFromPath === '1' ? 'Wumpus' : userIdFromPath === '2' ? 'Clyde' : 'Friend');

  const handleStartCall = (type: 'voice' | 'video') => {
    if (userIdFromPath) {
      dispatch(startCall({ userId: userIdFromPath, type }));
    }
  };

  return (
    <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 bg-[#313338] shrink-0 select-none gap-2">
      {/* Left section: Title */}
      <div className="flex items-center text-white min-w-0 overflow-hidden flex-1 md:flex-initial">
        {/* Toggle Left Sidebar Button for Mobile */}
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden mr-2 p-1 text-[#b5bac1] hover:text-[#dbdee1] transition-colors focus:outline-none shrink-0"
          title="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isDM ? (
          <>
            <UserAvatar user={currentFriend || { username: friendName }} size="sm" className="mr-2 shrink-0" />
            <span className="font-semibold text-base truncate">{friendName}</span>
            <div className="ml-2 w-3 h-3 bg-[#23a559] border-2 border-[#313338] rounded-full shrink-0"></div>
          </>
        ) : isMePage ? (
          <>
            <svg className="w-6 h-6 mr-2 text-[#80848e] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 11a1 1 0 0 1-2 0c0-2.33-2.33-4-5-4H10c-2.67 0-5 1.67-5 4a1 1 0 1 1-2 0c0-3.33 3.33-6 7-6h4c3.67 0 7 2.67 7 6Z"/></svg>
            <span className="font-semibold text-base shrink-0 mr-2 md:mr-0">Friends</span>
            <div className="hidden md:block w-[1px] h-6 bg-[#3f4147] mx-4 shrink-0"></div>
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium overflow-x-auto hide-scrollbar py-1 flex-1 min-w-0 md:flex-initial">
              <button 
                onClick={() => setActiveTab?.('all')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab?.('pending')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors whitespace-nowrap ${activeTab === 'pending' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveTab?.('blocked')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors whitespace-nowrap ${activeTab === 'blocked' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                Blocked
              </button>
              <button 
                onClick={() => setActiveTab?.('add_friend')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors font-medium whitespace-nowrap ${activeTab === 'add_friend' ? 'text-[#23a55a] bg-transparent' : 'bg-[#248046] hover:bg-[#1a6535] text-white'}`}
              >
                Add Friend
              </button>
            </div>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-2 text-[#80848e] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.82 10l-.67 4H9.18l.67-4h4.97Z"/></svg>
            <span className="font-semibold text-base truncate">general</span>
          </>
        )}
      </div>

      {/* Right section: Icons and Search */}
      <div className="flex items-center gap-2 md:gap-4 text-[#b5bac1] shrink-0">
        {/* Call Icons for DM */}
        {isDM && (
          <div className="flex items-center gap-2 md:gap-4 mr-1 md:mr-2">
            <button 
              onClick={() => handleStartCall('voice')}
              className="hover:text-[#dbdee1]" 
              title="Start Audio Call"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.58 1 1 0 0 1-.24 1.02l-2.21 2.19Z"/></svg>
            </button>
            <button 
              onClick={() => handleStartCall('video')}
              className="hover:text-[#dbdee1]" 
              title="Start Video Call"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
            </button>
          </div>
        )}

        {/* Server Icons */}
        {!isMePage && (
          <>
            <button className="hover:text-[#dbdee1]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z"/></svg></button>
            
            {/* Toggle Member List */}
            <button 
              onClick={() => dispatch(toggleMemberList())}
              className={`hover:text-[#dbdee1] transition-colors ${isMemberListOpen ? 'text-white' : ''}`}
              title="Toggle Member List"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </button>
          </>
        )}
        
        {/* Search Input */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-32 md:w-36 transition-all focus:w-48 md:focus:w-60 h-6 px-1.5 pb-0.5 rounded bg-[#1e1f22] text-[#dbdee1] placeholder-[#80848e] text-sm outline-none border-none shadow-inner"
          />
          <svg className="w-4 h-4 absolute right-1.5 top-1 text-[#80848e]" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/></svg>
        </div>
        
        {/* Help Icon */}
        <button className="hover:text-[#dbdee1] focus:outline-none" title="Help">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 17h-2v-2h2v2Zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default AppNavbar;

