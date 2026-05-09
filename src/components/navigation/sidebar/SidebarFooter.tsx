import React from 'react';
import { useAppSelector } from '../../../hooks/useAppStore';

const SidebarFooter: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="h-[52px] bg-[#232428] flex items-center px-2 py-1.5 shrink-0">
      {/* User Profile Area */}
      <div className="flex items-center hover:bg-[#3f4147] px-1 py-1 rounded cursor-pointer flex-1 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-[#5865f2] relative overflow-hidden shrink-0">
          {user?.avatarURL ? (
            <img src={user.avatarURL} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0) || 'U'}
            </div>
          )}
          {/* Status Indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] border-[2px] border-[#232428] rounded-full group-hover:border-[#3f4147] transition-colors"></div>
        </div>
        
        <div className="ml-2 flex flex-col overflow-hidden leading-tight">
          <span className="text-white text-sm font-semibold truncate">{user?.username || 'Guest'}</span>
          <span className="text-[#b5bac1] text-xs truncate">Online</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center text-[#b5bac1]">
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] hover:text-[#dbdee1] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] hover:text-[#dbdee1] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#3f4147] hover:text-[#dbdee1] transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
