/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import ws from '../services/ws';
import { messageCreated, messageDeleted, messageUpdated } from '../store/slices/messageSlice';
import { userTyped, userStoppedTyping } from '../store/slices/channelSlice';

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
      dispatch(messageCreated(data));
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

    return () => {
      ws.off('MESSAGE_CREATE');
      ws.off('MESSAGE_DELETE');
      ws.off('MESSAGE_UPDATE');
      ws.off('TYPING_START');
      ws.off('TYPING_STOP');
    };
  }, [auth.token, hasListenedToWS, dispatch]);

  return null; // This component only listens for events
};

export default WSListener;
