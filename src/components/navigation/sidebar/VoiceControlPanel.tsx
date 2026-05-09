import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppStore';
import { leaveVoiceChannel } from '../../../store/slices/uiSlice';

const VoiceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeVoiceChannel = useAppSelector((state) => state.ui.activeVoiceChannel);

  if (!activeVoiceChannel) return null;

  return (
    <div className="bg-[#232428] border-b border-[#1e1f22] px-2 py-1.5 flex flex-col gap-1">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[#23a559] font-bold text-xs uppercase tracking-wide">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
            <span className="truncate">Voice Connected</span>
          </div>
          <div className="text-[#b5bac1] text-xs truncate hover:underline cursor-pointer">
            {activeVoiceChannel.name} / {activeVoiceChannel.guildId === 'hust-server' ? 'HustCord' : 'Server'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => dispatch(leaveVoiceChannel())}
            className="p-1.5 rounded hover:bg-[#3f4147] text-[#b5bac1] hover:text-white transition-colors"
            title="Disconnect"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.41 5.41 17 4l-5 5-5-5L5.41 5.41 10.59 10.59 5.41 15.76 7 17.17l5-5 5 5 1.41-1.41L13.41 10.59 18.41 5.41Z"/></svg>
          </button>
        </div>
      </div>
      
      {/* Voice Controls (Video, Screen Share, Activity) */}
      <div className="flex items-center gap-1 px-1">
        <button className="flex-1 h-8 rounded bg-[#313338] hover:bg-[#3f4147] text-[#dbdee1] flex items-center justify-center gap-2 text-xs font-medium transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
          Video
        </button>
        <button className="flex-1 h-8 rounded bg-[#313338] hover:bg-[#3f4147] text-[#dbdee1] flex items-center justify-center gap-2 text-xs font-medium transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2Zm0 14H3V5h18v12Z"/></svg>
          Screen
        </button>
      </div>
    </div>
  );
};

export default VoiceControlPanel;
