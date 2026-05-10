import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { endCall } from '../../store/slices/uiSlice';

const CallOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeCall = useAppSelector((state) => state.ui.activeCall);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  if (!activeCall) return null;

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleDeafen = () => {
    const newDeafen = !isDeafened;
    setIsDeafened(newDeafen);
    // Discord logic: Nếu Deafen thì tự động Mute luôn
    if (newDeafen) {
      setIsMuted(true);
    }
  };

  const handleToggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const handleEndCall = () => {
    if (activeCall) {
      const targetUserId = activeCall.userId;
      dispatch(endCall());
      // Điều hướng về kênh chat văn bản của người dùng này
      navigate(`/channels/@me/${targetUserId}`);
    }
  };

  // Fake data based on userId
  const friendName = activeCall.userId === '1' ? 'Wumpus' : activeCall.userId === '2' ? 'Clyde' : 'Friend';

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col overflow-hidden">
      {/* Video Grid / Call Info */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {activeCall.type === 'video' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
             {/* Friend Video (Placeholder) */}
             <div className="bg-[#2b2d31] rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-transparent hover:border-[#5865f2] transition-colors">
                <div className="w-24 h-24 bg-gray-500 rounded-full mb-4"></div>
                <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-xs text-white">{friendName}</div>
             </div>
             {/* My Video (Placeholder) */}
             <div className={`bg-[#2b2d31] rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-transparent hover:border-[#5865f2] transition-colors ${isCameraOff ? 'grayscale opacity-50' : ''}`}>
                {isCameraOff ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full mb-2 flex items-center justify-center">
                      <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-indigo-500 rounded-full mb-4"></div>
                )}
                
                {/* Status indicators overlay on my video */}
                <div className="absolute top-4 right-4 flex gap-2">
                   {isMuted && (
                     <div className="bg-[#f23f43] p-1.5 rounded-full text-white shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
                     </div>
                   )}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-xs text-white">You (Hustler)</div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 bg-gray-500 rounded-full mb-6 relative ${activeCall.status === 'calling' ? 'animate-pulse' : ''}`}>
               {activeCall.status === 'calling' && (
                 <div className="absolute inset-0 rounded-full border-4 border-[#5865f2] animate-ping opacity-75"></div>
               )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{friendName}</h2>
            <p className="text-[#b5bac1]">
              {activeCall.status === 'calling' ? 'Calling...' : 'Voice Connected'}
            </p>
          </div>
        )}
      </div>

      {/* Call Toolbar */}
      <div className="h-24 bg-black/40 backdrop-blur-md flex items-center justify-center gap-4 px-6">
        {/* Camera Toggle */}
        {activeCall.type === 'video' && (
          <button 
            onClick={handleToggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOff ? 'bg-[#313338] text-white' : 'bg-white text-black hover:bg-gray-200'}`}
            title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
          </button>
        )}
        
        {/* Deafen Toggle */}
        <button 
          onClick={handleToggleDeafen}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDeafened ? 'bg-[#f23f43] text-white' : 'bg-[#313338] text-white hover:bg-[#3f4147]'}`}
          title={isDeafened ? "Undeafen" : "Deafen"}
        >
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10v7a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5v-2a7 7 0 0 1 14 0v2h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-7a10 10 0 0 0-10-10Z"/></svg>
        </button>

        {/* Mute Toggle */}
        <button 
          onClick={handleToggleMute}
          disabled={isDeafened} // Discord không cho phép bỏ mute khi đang deafen
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-[#f23f43] text-white' : 'bg-[#313338] text-white hover:bg-[#3f4147]'} ${isDeafened ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
        </button>

        {/* Disconnect Button */}
        <button 
          onClick={handleEndCall}
          className="w-12 h-12 rounded-full bg-[#f23f43] text-white hover:bg-[#da373c] flex items-center justify-center transition-colors shadow-lg"
          title="Disconnect"
        >
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.58 1 1 0 0 1-.24 1.02l-2.21 2.19Z" transform="rotate(135 12 12)"/></svg>
        </button>
      </div>
    </div>
  );
};

export default CallOverlay;
