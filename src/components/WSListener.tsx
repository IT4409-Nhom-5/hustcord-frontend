/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import ws from '../services/ws';
import { messageCreated, messageDeleted, messageUpdated } from '../store/slices/messageSlice';
import { userTyped, userStoppedTyping } from '../store/slices/channelSlice';
import { channelCreated, channelDeleted, created, deleted } from '../store/slices/guildSlice';

const WSListener: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasListenedToWS = useAppSelector((state) => state.meta.hasListenedToWS);
  const auth = useAppSelector((state) => state.auth);
  const ui = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (!auth.token || hasListenedToWS) return;

    // Connect to WebSocket
    ws.connect();

    // Listen for events
    ws.on('MESSAGE_CREATE', (data: any) => {
      // Chuẩn hóa dữ liệu nhận được từ Socket
      const mappedMessage = {
        ...data,
        content: data.text,
        authorId: data.userId,
        recipientId: data.recipientId,
        author: data.user || { username: 'User' }
      };
      dispatch(messageCreated(mappedMessage));
    });

    ws.on('MESSAGE_DELETE', (data: any) => {
      dispatch(messageDeleted(data));
    });

    ws.on('MESSAGE_UPDATE', (data: any) => {
      dispatch(messageUpdated(data));
    });

    ws.on('TYPING_START', (data: any) => {
      dispatch(userTyped(data));
    });

    ws.on('TYPING_STOP', (data: any) => {
      dispatch(userStoppedTyping(data));
    });

    ws.on('CHANNEL_CREATE', (data: any) => {
      console.log('📡 Received CHANNEL_CREATE:', data);
      const isVoice = data.description?.includes('VOICE') || data.name.includes('voice');
      const targetGuildId = data.guildId;
      
      if (targetGuildId) {
        dispatch(channelCreated({ 
          guildId: targetGuildId, 
          channel: {
            id: data.id,
            name: data.name,
            type: isVoice ? 'VOICE' : 'TEXT',
            guildId: targetGuildId,
            createdAt: data.createdAt
          } 
        }));
      }
    });

    ws.on('GUILD_CREATE', (data: any) => {
      console.log('📡 Received GUILD_CREATE:', data);
      dispatch(created({ guild: data }));
    });

    ws.on('CHANNEL_DELETE', (data: { id: string; guildId: string }) => {
      console.log('📡 Received CHANNEL_DELETE:', data);
      if (data.guildId) {
        dispatch(channelDeleted({ 
          channelId: data.id, 
          guildId: data.guildId 
        }));
      }
    });

    ws.on('GUILD_DELETE', (data: { guildId: string }) => {
      console.log('📡 Received GUILD_DELETE:', data);
      dispatch(deleted({ guildId: data.guildId }));
    });

    return () => {
      ws.off('MESSAGE_CREATE');
      ws.off('MESSAGE_DELETE');
      ws.off('MESSAGE_UPDATE');
      ws.off('TYPING_START');
      ws.off('TYPING_STOP');
      ws.off('CHANNEL_CREATE');
      ws.off('GUILD_CREATE');
      ws.off('CHANNEL_DELETE');
      ws.off('GUILD_DELETE');
    };
  }, [auth.token, hasListenedToWS, dispatch]);

  return null; // This component only listens for events
};

export default WSListener;
