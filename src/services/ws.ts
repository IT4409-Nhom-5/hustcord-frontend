import { io, Socket } from 'socket.io-client';

// Hardcode API URL for now, later move to env
const API_URL = 'http://localhost:3000';

const ws = io(API_URL, {
  secure: false, // Set to true if using https
  path: '/ws', // Or whatever your backend socket path is
  transports: ['websocket', 'polling'],
  autoConnect: false, // We'll connect manually when needed
});

ws.on('connect', () => console.log('Connected to WS Server'));

export default ws;
