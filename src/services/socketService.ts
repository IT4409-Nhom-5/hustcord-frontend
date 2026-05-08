import { io, Socket } from 'socket.io-client';
import type { Message } from '../types';

class SocketService {
  private socket: Socket | null = null;

  // Khởi tạo kết nối với token xác thực
  connect(token: string) {
    if (!this.socket) {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      this.socket = io(url, {
        auth: { token },
        transports: ['websocket'], // Ưu tiên dùng websocket trực tiếp thay vì polling
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket Connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket Disconnected');
      });
    }
  }

  // Ngắt kết nối (dùng khi user đăng xuất)
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Tham gia vào một room/channel để nhận tin nhắn mới
  joinChannel(channelId: string) {
    this.socket?.emit('joinChannel', { channelId });
  }

  // Gửi tin nhắn
  sendMessage(channelId: string, content: string) {
    this.socket?.emit('sendMessage', { channelId, content });
  }

  // Lắng nghe sự kiện nhận tin nhắn mới
  onReceiveMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.off('newMessage'); // Xóa listener cũ tránh bị lặp khi re-render
      this.socket.on('newMessage', callback);
    }
  }

  // Trả về instance để các component có thể lắng nghe (on) các sự kiện (như nhận tin nhắn mới)
  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;
