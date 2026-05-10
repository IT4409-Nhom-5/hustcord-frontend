import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { leaveVoiceChannel } from '../../store/slices/uiSlice';
import type { Channel } from '../../types';

const VoiceCallArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ui = useAppSelector((state) => state.ui);
  const guilds = useAppSelector((state) => state.guilds.list); // Lấy danh sách guilds
  const activeVoiceChannel = ui.activeVoiceChannel;
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Giả lập danh sách người trong phòng
  const participants = [
    { id: 'me', name: 'Hustler (You)', color: 'bg-indigo-500', isSpeaking: false },
    { id: '1', name: 'Wumpus', color: 'bg-gray-500', isSpeaking: true },
    { id: '2', name: 'Clyde', color: 'bg-indigo-600', isSpeaking: false },
  ];

  const handleLeaveVoice = () => {
    if (activeVoiceChannel) {
      dispatch(leaveVoiceChannel());
      
      const guildId = activeVoiceChannel.guildId;
      const currentGuild = guilds.find(g => g.id === guildId);
      
      // Tìm kênh văn bản đầu tiên trong guild đó để điều hướng về
      const firstTextChannel = currentGuild?.channels?.find((c: Channel) => c.type === 'TEXT');
      if (firstTextChannel) {
        navigate(`/channels/${guildId}/${firstTextChannel.id}`);
      } else {
        navigate(`/channels/${guildId}`); // Fallback nếu không tìm thấy kênh văn bản nào
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f22] relative overflow-hidden">
      {/* Voice Room Header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm bg-[#313338]">
        <svg className="w-6 h-6 text-[#80848e] mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
        <span className="font-bold text-white">{activeVoiceChannel?.name || 'Voice Channel'}</span>
      </div>

      {/* Participants Grid */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#1e1f22]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full max-h-[80vh]">
          {participants.map((p) => (
            <div 
              key={p.id}
              className={`
                aspect-video bg-[#2b2d31] rounded-lg flex flex-col items-center justify-center relative group
                border-2 transition-all duration-200
                ${p.isSpeaking ? 'border-[#23a559] shadow-[0_0_10px_rgba(35,165,89,0.3)]' : 'border-transparent'}
              `}
            >
              {/* Avatar */}
              <div className={`w-20 h-20 ${p.color} rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-lg`}>
                {p.name.charAt(0)}
              </div>
              <span className="text-white font-medium text-sm">{p.name}</span>
              
              {/* Indicators */}
              <div className="absolute bottom-2 left-2 flex gap-1">
                {!p.isSpeaking && (
                   <div className="bg-black/50 p-1 rounded-full text-white">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls Area (Discord Style) */}
      <div className="h-20 bg-[#1e1f22] border-t border-[#2b2d31] flex items-center justify-center gap-4 px-4">
        <button 
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isCameraOn ? 'bg-white text-black' : 'bg-[#313338] text-[#dbdee1] hover:bg-[#3f4147]'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
        </button>
        <button className="w-14 h-14 rounded-full bg-[#313338] text-[#dbdee1] flex items-center justify-center hover:bg-[#3f4147] transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2Zm0 14H3V5h18v12Z"/></svg>
        </button>
        <button 
          onClick={handleLeaveVoice}
          className="w-14 h-14 rounded-full bg-[#da373c] text-white flex items-center justify-center hover:bg-[#a1282b] transition-colors"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.41 5.41 17 4l-5 5-5-5L5.41 5.41 10.59 10.59 5.41 15.76 7 17.17l5-5 5 5 1.41-1.41L13.41 10.59 18.41 5.41Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default VoiceCallArea;
