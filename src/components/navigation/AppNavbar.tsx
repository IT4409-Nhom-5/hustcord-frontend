import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppStore';
import { startCall } from '../../store/slices/uiSlice';

const AppNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  // Lấy userId trực tiếp từ pathname (vd: /channels/@me/1 -> userId = 1)
  const pathParts = location.pathname.split('/');
  const isMePage = pathParts[1] === 'channels' && pathParts[2] === '@me';
  const userIdFromPath = pathParts[3]; 
  
  const isDM = isMePage && userIdFromPath;

  // Fake data for friend name in DM
  const friendName = userIdFromPath === '1' ? 'Wumpus' : userIdFromPath === '2' ? 'Clyde' : 'Friend';

  const handleStartCall = (type: 'voice' | 'video') => {
    if (userIdFromPath) {
      dispatch(startCall({ userId: userIdFromPath, type }));
    }
  };

  return (
    <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 bg-[#313338] shrink-0">
      {/* Left section: Title */}
      <div className="flex items-center text-white min-w-0">
        {isDM ? (
          <>
            <div className="w-6 h-6 rounded-full bg-gray-500 mr-2 flex-shrink-0"></div>
            <span className="font-semibold text-base truncate">{friendName}</span>
            <div className="ml-2 w-3 h-3 bg-[#23a559] border-2 border-[#313338] rounded-full"></div>
          </>
        ) : isMePage ? (
          <>
            <svg className="w-6 h-6 mr-2 text-[#80848e]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 11a1 1 0 0 1-2 0c0-2.33-2.33-4-5-4H10c-2.67 0-5 1.67-5 4a1 1 0 1 1-2 0c0-3.33 3.33-6 7-6h4c3.67 0 7 2.67 7 6Z"/></svg>
            <span className="font-semibold text-base">Friends</span>
            <div className="hidden md:block w-[1px] h-6 bg-[#3f4147] mx-4"></div>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <span className="text-white cursor-pointer px-2 py-0.5 rounded bg-[#3f4147]">Online</span>
              <span className="text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer">All</span>
              <span className="text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer">Pending</span>
              <span className="text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer">Blocked</span>
              <span className="text-[#23a559] hover:bg-[#23a559]/10 cursor-pointer px-2 py-0.5 rounded">Add Friend</span>
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
            <button className="hover:text-[#dbdee1]" title="Pinned Messages">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 9V4l1 1V2H7v2l1-1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3Z"/></svg>
            </button>
            <button className="hover:text-[#dbdee1]" title="Add Friends to DM">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4Zm-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2ZM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4Zm2 0c.2-1.1 3.11-2 6-2s5.8 1 6 2H3Zm16-3v-3h-3v-2h3V7h2v3h3v2h-3v3h-2Z"/></svg>
            </button>
          </div>
        )}

        {/* Server Icons */}
        {!isMePage && (
          <>
            <button className="hover:text-[#dbdee1]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z"/></svg></button>
            <button className="hover:text-[#dbdee1]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 8.005h4v2h-4v-2Zm-10 2h8v-2H4v2Zm10 4h4v2h-4v-2Zm-10 2h8v-2H4v2Zm0-12h16v2H4v-2Z"/></svg></button>
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

