import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { setIncomingCall, clearIncomingCall, setCallStatus, endCall, startCall, leaveVoiceChannel } from '../store/slices/uiSlice';
import ws from '../services/ws';

interface VoiceParticipant {
  userId: string;
  username: string;
  stream: MediaStream | null;
  isMuted?: boolean;
  isCameraOff?: boolean;
}

interface CallContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null; // For 1-to-1 direct calls
  remoteMediaStatus: { isMuted: boolean; isCameraOff: boolean };
  setRemoteMediaStatus: (status: { isMuted: boolean; isCameraOff: boolean }) => void;
  voiceParticipants: VoiceParticipant[]; // For Voice Channels
  isMuted: boolean;
  isDeafened: boolean;
  isCameraOff: boolean;
  initiateCall: (targetUserId: string, type: 'voice' | 'video') => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  rejectIncomingCall: () => void;
  hangup: () => void;
  toggleCamera: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
  joinVoiceRoom: (channelId: string) => Promise<void>;
  leaveVoiceRoom: (channelId: string) => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const activeCall = useAppSelector((state) => state.ui.activeCall);
  const activeVoiceChannel = useAppSelector((state) => state.ui.activeVoiceChannel);
  const incomingCall = useAppSelector((state) => state.ui.incomingCall);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteMediaStatus, setRemoteMediaStatus] = useState({ isMuted: false, isCameraOff: false });

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null); // For direct call
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map()); // socketId -> RTCPeerConnection
  const iceCandidateQueue = useRef<Map<string, RTCIceCandidate[]>>(new Map()); // socketId -> candidates[]
  const currentCallId = useRef<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const activeCallRef = useRef(activeCall);
  const activeVoiceChannelRef = useRef(activeVoiceChannel);
  const joiningRef = useRef<string | null>(null);

  // Đồng bộ Refs với Redux State
  useEffect(() => { activeCallRef.current = activeCall; }, [activeCall]);
  useEffect(() => { activeVoiceChannelRef.current = activeVoiceChannel; }, [activeVoiceChannel]);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
    iceTransportPolicy: 'all',
  };

  const cleanup = useCallback(() => {
    try {
      // 1. Dừng Camera/Mic
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        localStreamRef.current = null;
      }
      setLocalStream(null);

      // 2. Đóng kết nối 1-1
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      
      // 3. Đóng tất cả kết nối phòng
      pcsRef.current.forEach(pc => {
        pc.getSenders().forEach(sender => pc.removeTrack(sender));
        pc.close();
      });
      pcsRef.current.clear();
      iceCandidateQueue.current.clear();
      
      setRemoteStream(null);
      setVoiceParticipants([]);
      currentCallId.current = null;

      // 4. Cập nhật trạng thái ứng dụng
      dispatch(endCall());
      dispatch(leaveVoiceChannel());
      dispatch(clearIncomingCall());
      
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  }, [dispatch]);

  const broadcastMediaStatus = useCallback((targetSocketId?: string, forceMute?: boolean, forceCam?: boolean) => {
    if (!socketRef.current || !currentUser) return;
    
    const statusPayload = {
      type: 'media-status',
      userId: currentUser.id,
      isMuted: forceMute !== undefined ? forceMute : isMuted,
      isCameraOff: forceCam !== undefined ? forceCam : isCameraOff
    };

    if (targetSocketId) {
      socketRef.current.emit('voice-signal', { 
        to: targetSocketId, 
        from: currentUser.id, 
        fromUsername: currentUser.username, 
        signal: statusPayload 
      });
    } else if (activeVoiceChannelRef.current) {
      socketRef.current.emit('voice-signal', { 
        channelId: activeVoiceChannelRef.current.id,
        from: currentUser.id,
        fromUsername: currentUser.username,
        signal: statusPayload
      });
    }
  }, [currentUser, isMuted, isCameraOff]);

  useEffect(() => {
    const timer = setTimeout(() => broadcastMediaStatus(), 500);
    return () => clearTimeout(timer);
  }, [isMuted, isCameraOff, broadcastMediaStatus]);

  useEffect(() => {
    if (!currentUser?.id) return;

    console.log(`>>> [SOCKET VIDEO] Initializing video socket via multiplexing`);

    const socket = ws.io.socket("/video");
    socketRef.current = socket;

    socket.connect();

    const registerUser = () => {
      console.log(`>>> [SOCKET VIDEO] Registered successfully with userId: ${currentUser.id}`);
      socket.emit('register', currentUser.id);
    };

    if (socket.connected) {
      registerUser();
    }

    socket.on('connect', registerUser);

    socket.on('connect_error', (err) => {
      console.error('>>> [SOCKET VIDEO] Connection error:', err.message);
    });

    socket.on('voice-signal', async (data: { from: string; fromSocketId: string; fromUsername?: string; channelId?: string; signal: any }) => {
      const { fromSocketId, from, fromUsername, signal, channelId } = data;
      
      const currentActiveCall = activeCallRef.current;
      const currentActiveVoiceChannel = activeVoiceChannelRef.current;

      // 1. Trạng thái Mic/Cam
      if (signal.type === 'media-status') {
        const targetUserId = signal.userId || from;
        
        setVoiceParticipants(prev => prev.map(p => 
          p.userId === targetUserId ? { ...p, isMuted: signal.isMuted, isCameraOff: signal.isCameraOff } : p
        ));
        
        if (!channelId && currentActiveCall && (from === currentActiveCall.userId || fromSocketId === currentActiveCall.userId)) {
          setRemoteMediaStatus({ isMuted: signal.isMuted, isCameraOff: signal.isCameraOff });
        }
        return;
      }

      // 2. Kênh thoại Server (Multi-party)
      // CHẤP NHẬN tín hiệu là của PHÒNG nếu gói tin có channelId 
      const isRoomSignal = !!channelId;
      const effectiveChannelId = channelId || currentActiveVoiceChannel?.id || joiningRef.current;
      
      if (isRoomSignal && effectiveChannelId) {
        if (signal.type === 'offer') {
          await handleRoomOffer(fromSocketId, from, fromUsername || 'Someone', signal, effectiveChannelId);
          return;
        } else if (signal.type === 'answer') {
          console.log(`>>> [ROOM] Processing answer from ${fromUsername || 'Someone'}`);
          const pc = pcsRef.current.get(fromSocketId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            return;
          }
        } else if (signal.candidate) {
          const pc = pcsRef.current.get(fromSocketId);
          if (pc && pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(signal));
          } else {
            const queue = iceCandidateQueue.current.get(fromSocketId) || [];
            queue.push(new RTCIceCandidate(signal));
            iceCandidateQueue.current.set(fromSocketId, queue);
          }
          return;
        }
      }

      // 3. Cuộc gọi riêng (1-1)
      if (!isRoomSignal) {
        const isDirectCall = currentActiveCall && (from === currentActiveCall.userId || fromSocketId === currentActiveCall.userId || from === currentActiveCall.id);
        const isNewOffer = signal.type === 'offer' && !currentActiveVoiceChannel;

        if (isDirectCall || isNewOffer) {
          if (signal.type === 'offer') {
            const stream = localStreamRef.current;
            if (!stream) return;

            if (!pcRef.current || pcRef.current.signalingState === 'closed') {
              const pc = new RTCPeerConnection(configuration);
              pcRef.current = pc;
              pc.onicecandidate = (e) => {
                if (e.candidate) socket.emit('voice-signal', { to: fromSocketId || from, from: currentUser.id, signal: e.candidate });
              };
              pc.ontrack = (e) => {
                if (e.streams && e.streams[0]) setRemoteStream(e.streams[0]);
              };
              stream.getTracks().forEach(track => pc.addTrack(track, stream));
            }
            
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            const targetId = fromSocketId || from;
            const queue = iceCandidateQueue.current.get(targetId) || [];
            for (const candidate of queue) await pcRef.current.addIceCandidate(candidate);
            iceCandidateQueue.current.delete(targetId);
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit('voice-signal', { to: targetId, from: currentUser.id, signal: answer });
            
          } else if (signal.type === 'answer') {
            if (pcRef.current && pcRef.current.signalingState !== 'closed') {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            }
          } else if (signal.candidate) {
            if (pcRef.current && pcRef.current.remoteDescription && pcRef.current.signalingState !== 'closed') {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(signal));
            } else {
              const targetId = fromSocketId || from;
              const queue = iceCandidateQueue.current.get(targetId) || [];
              queue.push(new RTCIceCandidate(signal));
              iceCandidateQueue.current.set(targetId, queue);
            }
          }
        }
      }
    });

    socket.on('incoming-call', (data: { from: string, type: 'voice' | 'video', callId: string }) => {
      dispatch(setIncomingCall(data));
    });

    socket.on('call-accepted', async (data: { callId: string, from: string }) => {
      dispatch(setCallStatus('connected'));
      
      let attempts = 0;
      while (!localStreamRef.current && attempts < 150) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      const stream = localStreamRef.current;
      if (!stream) return;

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit('voice-signal', { to: data.from, from: currentUser.id, signal: e.candidate });
      };

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
      };

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      socket.emit('voice-signal', { to: data.from, from: currentUser.id, signal: offer });
    });

    socket.on('call-rejected', (_data: { callId: string }) => {
      console.log(">>> [RECV] Call rejected");
      dispatch(clearIncomingCall());
      dispatch(endCall());
      cleanup();
    });

    socket.on('call-ended', (_data: { callId: string }) => {
      console.log(">>> [RECV] Call ended");
      dispatch(endCall());
      cleanup();
    });

    socket.on('user-joined-voice', async (data: { userId: string; username: string; socketId: string; channelId: string }) => {
      console.log(`>>> User joined room: ${data.username} in channel ${data.channelId}`);
      // Gửi ngay trạng thái hiện tại của mình cho người mới vào
      broadcastMediaStatus(data.socketId);
      await createRoomOffer(data.socketId, data.userId, data.username, data.channelId);
    });

    socket.on('user-left-voice', (data: { userId: string }) => {
      setVoiceParticipants(prev => prev.filter(p => p.userId !== data.userId));
    });

    return () => { 
      console.log(">>> [SOCKET] Cleaning up video socket listeners...");
      socket.off('connect');
      socket.off('connect_error');
      socket.off('voice-signal');
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('user-joined-voice');
      socket.off('user-left-voice');
      socket.disconnect(); 
    };
  }, [currentUser?.id]);

  const toggleCamera = () => {
    const nextState = !isCameraOff;
    setIsCameraOff(nextState);
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = !nextState);
    broadcastMediaStatus(undefined, isMuted, nextState);
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !nextState);
    broadcastMediaStatus(undefined, nextState, isCameraOff);
  };

  const toggleDeafen = () => {
    const nextState = !isDeafened;
    setIsDeafened(nextState);
    const nextMute = nextState ? true : isMuted;
    
    if (nextState) {
      setIsMuted(true); // Tự động tắt mic nếu bị Điếc
      localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = false);
    }
    // Ngắt/Bật toàn bộ âm thanh từ những người khác
    voiceParticipants.forEach(p => {
      if (p.stream) {
        p.stream.getAudioTracks().forEach(track => {
          track.enabled = !nextState;
        });
      }
    });
    broadcastMediaStatus(undefined, nextMute, isCameraOff);
  };

  const initMedia = async (type: 'voice' | 'video') => {
    try {
      // Luôn thử lấy video nếu là cuộc gọi video HOẶC đang chuẩn bị vào phòng thoại
      const shouldRequestVideo = type === 'video' || type === 'voice'; 
      
      const constraints = {
        video: shouldRequestVideo,
        audio: { echoCancellation: true, noiseSuppression: true }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => {
          track.enabled = true;
          console.log(`>>> [MEDIA] Track ${track.kind} enabled: ${track.label}`);
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch (videoErr) {
        // Nếu lỗi do video (không có cam), thử lại chỉ với audio
        if (constraints.video) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
          setIsCameraOff(true); // Tự động đánh dấu là tắt cam
          return audioStream;
        }
        throw videoErr;
      }
    } catch (err) {
      return null;
    }
  };

  const createRoomPC = (targetSocketId: string, userId: string, username: string, stream: MediaStream, channelId: string) => {
    // Nếu đã có PC cho socketId này, dọn dẹp trước khi tạo mới
    const existingPC = pcsRef.current.get(targetSocketId);
    if (existingPC) {
      existingPC.close();
      pcsRef.current.delete(targetSocketId);
    }

    const pc = new RTCPeerConnection(configuration);

    pc.oniceconnectionstatechange = () => {
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit('voice-signal', { 
          to: targetSocketId, 
          from: currentUser?.id, 
          fromUsername: currentUser?.username, 
          channelId, // Sử dụng channelId được truyền vào, không dùng Ref
          signal: e.candidate 
        });
      }
    };

    pc.ontrack = (e) => {
      setVoiceParticipants(prev => {
        const existing = prev.find(p => p.userId === userId);
        
        if (existing) {
          // Nếu đã có participant, thêm track mới vào stream hiện có
          const currentStream = existing.stream || new MediaStream();
          if (!currentStream.getTracks().find(t => t.id === e.track.id)) {
            currentStream.addTrack(e.track);
          }
          // Luôn tạo mới đối tượng MediaStream để React kích hoạt re-render
          const updatedStream = new MediaStream(currentStream.getTracks());
          return prev.map(p => p.userId === userId ? { ...p, stream: updatedStream } : p);
        } else {
          // Người mới: ưu tiên dùng stream từ sự kiện, nếu không có thì tạo mới
          const newStream = e.streams[0] || new MediaStream([e.track]);
          return [...prev, { userId, username, stream: newStream, isMuted: false, isCameraOff: false }];
        }
      });
    };

    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    pcsRef.current.set(targetSocketId, pc);
    return pc;
  };

  const createRoomOffer = async (targetSocketId: string, userId: string, username: string, channelId: string) => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const pc = createRoomPC(targetSocketId, userId, username, stream, channelId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('voice-signal', {      to: targetSocketId, 
      from: currentUser?.id, 
      fromUsername: currentUser?.username, 
      channelId,
      signal: offer 
    });
  };

  const handleRoomOffer = async (fromSocketId: string, fromUserId: string, fromUsername: string, offer: RTCSessionDescriptionInit, channelId: string) => {
    // Đợi localStream
    let attempts = 0;
    while (!localStreamRef.current && attempts < 150) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    const stream = localStreamRef.current;
    if (!stream) return;

    const pc = createRoomPC(fromSocketId, fromUserId, fromUsername, stream, channelId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const queue = iceCandidateQueue.current.get(fromSocketId) || [];
    for (const candidate of queue) await pc.addIceCandidate(candidate);
    iceCandidateQueue.current.delete(fromSocketId);
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.emit('voice-signal', {      to: fromSocketId, 
      from: currentUser?.id, 
      fromUsername: currentUser?.username, 
      channelId,
      signal: answer 
    });
  };

  const hangup = () => {
    try {
      if (activeCallRef.current && socketRef.current) {
        socketRef.current.emit('end-call', { 
          callId: activeCallRef.current.id, 
          to: activeCallRef.current.userId, 
          from: currentUser?.id 
        });
      }
      cleanup();
    } catch (err) {
      cleanup();
    }
  };

  const joinVoiceRoom = async (channelId: string) => {
    // Nếu đang trong quá trình join cùng một phòng thì bỏ qua để tránh lặp
    if (joiningRef.current === channelId) return;
    joiningRef.current = channelId;
    
    try {
      setIsCameraOff(true); // Mặc định tắt camera khi vào phòng thoại
      
      const stream = await initMedia('voice');
      if (stream) {
        // Tắt track video ngay lập tức
        stream.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
      }
      
      if (socketRef.current && currentUser) {
        socketRef.current.emit('join-voice', { channelId, userId: currentUser.id, username: currentUser.username });
        setTimeout(() => broadcastMediaStatus(undefined, isMuted, true), 1500);
      }
    } catch (err) {
      joiningRef.current = null;
    }
  };

  const leaveVoiceRoom = (channelId: string) => {
    try {
      const channelToLeave = channelId || activeVoiceChannelRef.current?.id;
      if (socketRef.current && currentUser && channelToLeave) {
        socketRef.current.emit('leave-voice', { channelId: channelToLeave, userId: currentUser.id });
      }
      joiningRef.current = null;
      cleanup();
    } catch (err) {
      cleanup();
    }
  };

  const initiateCall = async (targetUserId: string, type: 'voice' | 'video') => {
    if (currentCallId.current) {
      return;
    }
    try {
      const stream = await initMedia(type);
      if (stream && socketRef.current && currentUser) {
        const callId = Math.random().toString(36).substring(7);
        currentCallId.current = callId;
        dispatch(startCall({ userId: targetUserId, type, id: callId }));
        
        socketRef.current.emit('video-call', {
          callId,
          from: currentUser.id,
          to: targetUserId,
          channelId: null,
          type
        });
      }
    } catch (err) {
    }
  };

  const acceptIncomingCall = async () => {
    if (!incomingCall || !socketRef.current || !currentUser) return;
    try {
      const stream = await initMedia(incomingCall.type);
      if (stream) {
        // Thiết lập cuộc gọi hoạt động cho người nghe
        dispatch(startCall({ 
          userId: incomingCall.from, 
          type: incomingCall.type, 
          id: incomingCall.callId 
        }));
        
        socketRef.current.emit('call-accepted', {
          callId: incomingCall.callId,
          to: currentUser.id,
          from: incomingCall.from
        });
        
        dispatch(setCallStatus('connected'));
        dispatch(clearIncomingCall()); // Xóa thông báo sau khi đã nghe
      }
    } catch (err) {
    }
  };

  const rejectIncomingCall = () => {
    if (!incomingCall || !socketRef.current || !currentUser) return;
    socketRef.current.emit('call-rejected', {
      callId: incomingCall.callId,
      to: currentUser.id,
      from: incomingCall.from
    });
    dispatch(clearIncomingCall());
  };

  return (
    <CallContext.Provider value={{ 
      localStream, remoteStream, voiceParticipants, isMuted, isDeafened, isCameraOff,
      remoteMediaStatus, setRemoteMediaStatus,
      initiateCall, acceptIncomingCall, rejectIncomingCall, hangup, 
      toggleCamera, toggleMute, toggleDeafen, joinVoiceRoom, leaveVoiceRoom
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within a CallProvider');
  return context;
};
