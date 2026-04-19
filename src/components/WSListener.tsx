// Component lắng nghe sự kiện WebSocket (WS Listener).
// Khi mount: kết nối WebSocket đến backend.
// Lắng nghe các event real-time: MESSAGE_CREATE, MESSAGE_DELETE, GUILD_UPDATE, v.v.
// Dispatch các action tương ứng vào Redux store khi nhận event.
// Được đặt trong PageWrapper để luôn active khi user đã đăng nhập.
// Tương ứng với "ws-listener.tsx" trong code gốc.
