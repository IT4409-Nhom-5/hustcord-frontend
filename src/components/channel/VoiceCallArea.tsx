import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';
import { useCall } from '../../context/CallContext';
import { useEffect, useRef } from 'react';

const VoiceCallArea: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const ui = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);
  const guilds = useAppSelector((state) => state.guilds.list); 
  const activeVoiceChannel = ui.activeVoiceChannel;

  const { 
    localStream, voiceParticipants, joinVoiceRoom, leaveVoiceRoom, 
    toggleCamera, toggleMute, isMuted, isCameraOff: globalCameraOff 
  } = useCall();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (channelId && activeVoiceChannel?.id !== channelId) {
      joinVoiceRoom(channelId);
    }
  }, [channelId, activeVoiceChannel]);

  const activeChannelRef = useRef(activeVoiceChannel?.id);
  useEffect(() => { activeChannelRef.current = activeVoiceChannel?.id; }, [activeVoiceChannel?.id]);

  useEffect(() => {
    return () => {
      // Khi component unmount (thoát trang), nếu vẫn còn ở trong phòng thì tự động thoát
      if (activeChannelRef.current) {
        leaveVoiceRoom(activeChannelRef.current);
      }
    };
  }, [leaveVoiceRoom]); // Chỉ chạy khi unmount

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const { guildId: urlGuildId } = useParams();
  
  const handleLeaveVoice = () => {
    // Ưu tiên guildId từ URL vì nó luôn chính xác nhất
    const guildId = urlGuildId || activeVoiceChannel?.guildId;
    const channelToLeave = activeVoiceChannel?.id || activeChannelRef.current;

    try {
      if (channelToLeave) {
        leaveVoiceRoom(channelToLeave);
      }
    } catch (err) {
    }

    if (guildId) {
      const currentGuild = guilds.find(g => g.id === guildId);
      // Tìm kênh 'general' (không phân biệt hoa thường)
      const generalChannel = currentGuild?.channels?.find((c: any) => 
        c.type === 'TEXT' && (c.name.toLowerCase() === 'general' || c.name.toLowerCase() === 'chung')
      ) || currentGuild?.channels?.find((c: any) => c.type === 'TEXT');
      
      if (generalChannel) {
        const targetPath = `/channels/${guildId}/${generalChannel.id}`;
        navigate(targetPath, { replace: true });
      } else {
        navigate(`/channels/${guildId}`, { replace: true });
      }
    } else {
      navigate('/channels/@me', { replace: true });
    }
  };

  const handleToggleCamera = () => {
    toggleCamera();
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f22] relative overflow-hidden">
      {/* Voice Room Header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm bg-[#313338]">
        <svg className="w-5 h-5 text-[#80848e] mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
        <span className="font-bold text-white text-sm">{activeVoiceChannel?.name || 'Voice Channel'}</span>
      </div>

      {/* Participants Grid */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#1e1f22]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Local User */}
          <div className={`aspect-video bg-[#2b2d31] rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-300 ring-offset-4 ring-offset-[#1e1f22] ${!isMuted ? 'ring-2 ring-[#23a559]' : ''}`}>
            {localStream && !globalCameraOff ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-2xl">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-2">
              {currentUser?.username} (You)
              {isMuted && <span className="text-[#da373c]"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg></span>}
            </div>
          </div>

          {/* Remote Participants */}
          {voiceParticipants.map((p) => (
            <RemoteParticipant key={p.userId} participant={p} />
          ))}
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="h-24 bg-[#1e1f22] border-t border-white/5 flex items-center justify-center gap-6 px-6">
        <button 
          onClick={handleToggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${!isMuted ? 'bg-white text-black' : 'bg-[#da373c] text-white hover:scale-110'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
        </button>
        <button 
          onClick={handleToggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${!globalCameraOff ? 'bg-white text-black' : 'bg-[#313338] text-white hover:bg-[#3f4147] hover:scale-110'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
        </button>
        <button 
          onClick={handleLeaveVoice}
          className="w-16 h-14 rounded-2xl bg-[#da373c] text-white flex items-center justify-center hover:bg-[#a1282b] transition-all hover:scale-105 shadow-lg"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.41 5.41 17 4l-5 5-5-5L5.41 5.41 10.59 10.59 5.41 15.76 7 17.17l5-5 5 5 1.41-1.41L13.41 10.59 18.41 5.41Z"/></svg>
        </button>
      </div>
    </div>
  );
};

const RemoteParticipant: React.FC<{ participant: any }> = ({ participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream && !participant.isCameraOff) {
      // CHỈ nạp lại nếu stream thực sự khác (tránh AbortError)
      if (currentStreamRef.current?.id !== participant.stream.id) {
        const vTracks = participant.stream.getVideoTracks().length;
        const aTracks = participant.stream.getAudioTracks().length;
        console.log(`>>> [VIEW] Attaching NEW stream to video for ${participant.username}: Video=${vTracks}, Audio=${aTracks}`);
        
        videoRef.current.srcObject = participant.stream;
        currentStreamRef.current = participant.stream;
        
        videoRef.current.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.warn(`>>> [VIEW] Playback failed for ${participant.username}:`, err);
          }
        });
      }
    }
  }, [participant.stream, participant.isCameraOff]);

  console.log(`>>> Rendering RemoteParticipant ${participant.username}: isMuted=${participant.isMuted}`);

  return (
    <div className={`aspect-video bg-[#2b2d31] rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-300 ring-offset-4 ring-offset-[#1e1f22] ${!participant.isMuted ? 'ring-2 ring-[#23a559]' : ''}`}>
      {participant.stream && !participant.isCameraOff ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className="w-full h-full object-cover rounded-2xl bg-black"
          onLoadedMetadata={(e) => {
            console.log(`>>> [VIEW] Metadata loaded for ${participant.username}, playing...`);
            (e.target as HTMLVideoElement).play();
          }}
        />
      ) : (
        <div className="w-24 h-24 bg-[#4e5058] rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-2xl">
          {participant.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-2">
        {participant.username}
        {participant.isMuted === true && <span className="text-[#da373c]"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg></span>}
      </div>
    </div>
  );
};

export default VoiceCallArea;
