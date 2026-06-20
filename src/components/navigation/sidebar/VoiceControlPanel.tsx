import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppStore';
import { leaveVoiceChannel } from '../../../store/slices/uiSlice';

import { useCall } from '../../../context/CallContext';

const VoiceControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ui = useAppSelector((state) => state.ui);
  const { isMuted, hangup, leaveVoiceRoom } = useCall();
  
  const { activeCall, activeVoiceChannel } = ui;

  // Chỉ hiển thị panel khi có kết nối âm thanh (DM hoặc Server Voice)
  if (!activeCall && !activeVoiceChannel) return null;

  const handleDisconnect = () => {
    console.log(">>> [ACTION] Disconnecting via VoiceControlPanel");
    if (activeCall) {
      const targetUserId = activeCall.userId;
      hangup(); // Gọi hàm ngắt kết nối thực tế
      navigate(`/channels/@me/${targetUserId}`);
    } else if (activeVoiceChannel) {
      const guildId = activeVoiceChannel.guildId;
      leaveVoiceRoom(activeVoiceChannel.id); // Gọi hàm rời phòng thực tế
      dispatch(leaveVoiceChannel());
      navigate(`/channels/${guildId}`);
    }
  };

  const title = activeCall ? 'Call Connected' : 'Voice Connected';
  const subtitle = activeCall ? 'Private Call' : activeVoiceChannel?.name;

  return (
    <div className="bg-[#232428] border-b border-[#1e1f22] p-2 px-3 flex items-center justify-between shrink-0">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 text-[#23a55a] hover:underline cursor-pointer">
          <div className="relative">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
            </svg>
            {isMuted && (
              <div className="absolute -top-1 -right-1 bg-[#232428] rounded-full p-0.5">
                <svg className="w-2.5 h-2.5 text-[#f23f43]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
              </div>
            )}
          </div>
          <span className="text-[13px] font-bold truncate leading-tight">{title}</span>
        </div>
        <div className="text-[#dbdee1] text-[12px] truncate opacity-90">
          {subtitle}
        </div>
      </div>
      
      <div className="flex items-center gap-0.5">
        <button 
          onClick={handleDisconnect}
          className="w-8 h-8 flex items-center justify-center text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#3f4147] rounded transition-colors"
          title="Disconnect"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.41 5.41 17 4l-5 5-5-5L5.41 5.41 10.59 10.59 5.41 15.76 7 17.17l5-5 5 5 1.41-1.41L13.41 10.59 18.41 5.41Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VoiceControlPanel;