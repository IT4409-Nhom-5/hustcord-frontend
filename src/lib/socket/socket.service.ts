import { io, Socket } from 'socket.io-client';
import type { Message } from '~/types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private videoSocket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });

    return this.socket;
  }

  connectVideo(token: string) {
    if (this.videoSocket?.connected) return this.videoSocket;

    this.videoSocket = io(`${SOCKET_URL}/video`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.videoSocket.on('connect', () => {
      console.log('[Video Socket] Connected:', this.videoSocket?.id);
    });

    this.videoSocket.on('disconnect', () => {
      console.log('[Video Socket] Disconnected');
    });

    this.videoSocket.on('error', (error) => {
      console.error('[Video Socket] Error:', error);
    });

    return this.videoSocket;
  }

  // Chat events
  onChatMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('chat', callback);
    }
  }

  sendChatMessage(message: Message) {
    if (this.socket) {
      this.socket.emit('chat', message);
    }
  }

  // Video events
  registerVideoUser(userId: string) {
    if (this.videoSocket) {
      this.videoSocket.emit('register', userId);
    }
  }

  onVideoCallIncoming(callback: (data: any) => void) {
    if (this.videoSocket) {
      this.videoSocket.on('incoming-call', callback);
    }
  }

  initiateVideoCall(callId: string, to: string, from: string, channelId: string) {
    if (this.videoSocket) {
      this.videoSocket.emit('video-call', { callId, to, from, channelId });
    }
  }

  acceptVideoCall(callId: string, to: string, from: string) {
    if (this.videoSocket) {
      this.videoSocket.emit('call-accepted', { callId, to, from });
    }
  }

  onCallAccepted(callback: (data: any) => void) {
    if (this.videoSocket) {
      this.videoSocket.on('call-accepted', callback);
    }
  }

  onVideoError(callback: (data: any) => void) {
    if (this.videoSocket) {
      this.videoSocket.on('error', callback);
    }
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
    if (this.videoSocket?.connected) {
      this.videoSocket.disconnect();
    }
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
    this.videoSocket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
