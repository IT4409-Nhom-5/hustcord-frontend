import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import socketService from '../services/socketService';
import { addMessage } from '../store/slices/guildSlice';

const WSListener: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    // Khởi tạo kết nối khi có token (user đã đăng nhập)
    socketService.connect(token);

    // Lắng nghe sự kiện nhận tin nhắn mới
    socketService.onReceiveMessage((message) => {
      dispatch(addMessage(message));
    });

    // Cleanup function: Ngắt kết nối khi component unmount
    return () => {
      socketService.disconnect();
    };
  }, [token, dispatch]);

  return null; // Component này chỉ xử lý logic ngầm, không hiển thị UI
};

export default WSListener;
