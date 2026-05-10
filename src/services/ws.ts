import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ws = io(API_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false, // Kết nối thủ công khi cần
  auth: (cb) => {
    // Gửi JWT token khi kết nối WS để xác thực
    const token = localStorage.getItem('token');
    cb({ token });
  },
});

ws.on('connect', () => console.log('✅ Connected to WS Server'));
ws.on('disconnect', () => console.log('❌ Disconnected from WS Server'));
ws.on('connect_error', (err) => console.error('WS Error:', err.message));

export default ws;
