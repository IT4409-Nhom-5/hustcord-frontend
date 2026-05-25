import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { startCall } from '../../store/slices/uiSlice';
import UserAvatar from '../user/UserAvatar';

interface AppNavbarProps {
  activeTab?: 'all' | 'pending' | 'blocked' | 'add_friend';
  setActiveTab?: (tab: 'all' | 'pending' | 'blocked' | 'add_friend') => void;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ activeTab = 'all', setActiveTab }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const friends = useAppSelector((state) => state.auth.friends) || [];
  
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
    <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 bg-[#313338] shrink-0 select-none">
      {/* Left section: Title */}
      <div className="flex items-center text-white min-w-0">
        {isDM ? (
          <>
            <UserAvatar user={currentFriend || { username: friendName }} size="sm" className="mr-2" />
            <span className="font-semibold text-base truncate">{friendName}</span>
            <div className="ml-2 w-3 h-3 bg-[#23a559] border-2 border-[#313338] rounded-full"></div>
          </>
        ) : isMePage ? (
          <>
            <svg className="w-6 h-6 mr-2 text-[#80848e] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 11a1 1 0 0 1-2 0c0-2.33-2.33-4-5-4H10c-2.67 0-5 1.67-5 4a1 1 0 1 1-2 0c0-3.33 3.33-6 7-6h4c3.67 0 7 2.67 7 6Z"/></svg>
            <span className="font-semibold text-base shrink-0">Friends</span>
            <div className="hidden md:block w-[1px] h-6 bg-[#3f4147] mx-4 shrink-0"></div>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <button 
                onClick={() => setActiveTab?.('all')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${activeTab === 'all' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab?.('pending')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${activeTab === 'pending' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveTab?.('blocked')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${activeTab === 'blocked' ? 'bg-[#3f4147] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                Blocked
              </button>
              <button 
                onClick={() => setActiveTab?.('add_friend')}
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors font-medium ${activeTab === 'add_friend' ? 'text-[#23a55a] bg-transparent' : 'bg-[#248046] hover:bg-[#1a6535] text-white'}`}
              >
                Add Friend
              </button>
            </div>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-2 text-[#80848e]" fill="currentColor" viewBox="0 0 24 24"><path d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.82 10l-.67 4H9.18l.67-4h4.97Z"/></svg>
            <span className="font-semibold text-base">general</span>
          </>
        )}
      </div>

      {/* Right section: Icons and Search */}
      <div className="flex items-center gap-4 text-[#b5bac1]">
        {/* Call Icons for DM */}
        {isDM && (
          <div className="flex items-center gap-4 mr-2">
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
    
          </>
        )}
        
        {/* Search Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-36 transition-all focus:w-60 h-6 px-1.5 pb-0.5 rounded bg-[#1e1f22] text-[#dbdee1] placeholder-[#80848e] text-sm outline-none border-none shadow-inner"
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

