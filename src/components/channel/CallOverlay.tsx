import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import { useCall } from '../../context/CallContext';
import { MicOff, VideoOff, PhoneOff, Mic, Video, Headphones } from 'lucide-react';

const CallOverlay: React.FC = () => {
  const activeCall = useAppSelector((state) => state.ui.activeCall);
  const { 
    localStream, 
    remoteStream, 
    remoteMediaStatus,
    initiateCall, 
    hangup, 
    toggleCamera, 
    toggleMute, 
    toggleDeafen,
    isMuted,
    isDeafened,
    isCameraOff
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const currentUser = useAppSelector((state) => state.auth.user);
  const friends = useAppSelector((state) => state.auth.friends);

  const initiatedRef = useRef(false);

  useEffect(() => {
    if (activeCall && activeCall.status === 'calling' && !initiatedRef.current) {
      initiatedRef.current = true;
      initiateCall(activeCall.userId, activeCall.type);
    }
    
    // Reset khi cuộc gọi kết thúc
    if (!activeCall) {
      initiatedRef.current = false;
    }
  }, [activeCall, initiateCall]); 

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!activeCall) return null;

  const handleToggleMute = () => {
    toggleMute();
  };

  const handleToggleDeafen = () => {
    toggleDeafen();
  };

  const handleToggleCamera = () => {
    toggleCamera();
  };

  const friend = friends.find(f => f.id === activeCall.userId);
  const friendName = friend?.username || (activeCall.userId === '550e8400-e29b-41d4-a716-446655440000' ? 'Wumpus' : activeCall.userId === '550e8400-e29b-41d4-a716-446655440001' ? 'Clyde' : 'Friend');
  const myName = currentUser?.username || 'You';

  return (
    <div className="absolute inset-0 z-50 bg-[#000000] flex flex-col overflow-hidden">
      {/* Video Grid / Call Info */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {activeCall.type === 'video' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-w-6xl mx-auto">
             {/* Friend Video */}
             <div className="bg-[#2b2d31] rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-transparent hover:border-[#5865f2] transition-colors shadow-2xl">
                <video ref={remoteVideoRef} autoPlay playsInline className={`w-full h-full object-cover ${remoteMediaStatus.isCameraOff ? 'hidden' : ''}`} />
                {remoteMediaStatus.isCameraOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1f22]">
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full mb-2 flex items-center justify-center">
                       <VideoOff className="w-10 h-10 text-indigo-500" />
                    </div>
                    <p className="text-white text-sm font-medium">{friendName} turned off camera</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                  {friendName}
                </div>
                {remoteMediaStatus.isMuted && (
                  <div className="absolute top-4 right-4 bg-[#f23f43] p-1.5 rounded-full text-white shadow-lg">
                    <MicOff className="w-4 h-4" />
                  </div>
                )}
                {!remoteStream && !remoteMediaStatus.isCameraOff && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2b2d31]">
                      <div className="w-24 h-24 bg-gray-500 rounded-full animate-pulse mb-4"></div>
                      <p className="text-[#b5bac1] animate-pulse">Waiting for connection...</p>
                   </div>
                )}
             </div>

             {/* My Video */}
             <div className="bg-[#2b2d31] rounded-2xl flex items-center justify-center relative overflow-hidden border-2 border-transparent hover:border-[#5865f2] transition-colors shadow-2xl">
                <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : ''}`} />
                {isCameraOff && (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full mb-2 flex items-center justify-center">
                      <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                  {myName}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                   {isMuted && (
                     <div className="bg-[#f23f43] p-1.5 rounded-full text-white shadow-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5Zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z"/></svg>
                     </div>
                   )}
                </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <video ref={localVideoRef} hidden muted autoPlay playsInline />
            <video ref={remoteVideoRef} hidden autoPlay playsInline />
            <div className={`w-32 h-32 bg-gray-500 rounded-full mb-6 relative ${activeCall.status === 'calling' ? 'animate-pulse' : 'ring-4 ring-[#23a55a]'}`}>
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
      <div className="h-24 bg-black/40 backdrop-blur-md flex items-center justify-center gap-4 px-6 border-t border-white/10">
        {activeCall.type === 'video' && (
          <button 
            onClick={handleToggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-[#313338] text-white' : 'bg-white text-black hover:scale-110'}`}
          >
            {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}
        
        <button 
          onClick={handleToggleDeafen}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDeafened ? 'bg-[#f23f43] text-white' : 'bg-[#313338] text-white hover:bg-[#3f4147]'}`}
        >
            <Headphones className="w-6 h-6" />
         </button>

        <button 
          onClick={handleToggleMute}
          disabled={isDeafened}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-[#f23f43] text-white' : 'bg-[#313338] text-white hover:bg-[#3f4147]'} ${isDeafened ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </button>

        <button 
          onClick={hangup}
          className="w-16 h-12 rounded-2xl bg-[#f23f43] text-white hover:bg-[#da373c] flex items-center justify-center transition-all shadow-lg hover:scale-105"
        >
            <PhoneOff className="w-7 h-7" />
         </button>
      </div>
    </div>
  );
};

export default CallOverlay;
