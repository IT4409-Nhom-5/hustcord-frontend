/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import ws from '../services/ws';
import { messageCreated, messageDeleted, messageUpdated } from '../store/slices/messageSlice';
import { userTyped, userStoppedTyping } from '../store/slices/channelSlice';
import { channelCreated, channelDeleted, created, deleted, setGuilds, fetchGuildsStart } from '../store/slices/guildSlice';
import api from '../services/api';

const WSListener: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasListenedToWS = useAppSelector((state) => state.meta.hasListenedToWS);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.token || hasListenedToWS) return;

    const fetchGuildsData = async () => {
      try {
        dispatch(fetchGuildsStart());
        const response = await api.get(`/channels/user/${auth.user?.id}`);
        if (response.data && response.data.generalChannels) {
          const { generalChannels, subChannels } = response.data;
          
          const mappedGuilds = generalChannels.map((gc: any) => {
            const guildId = gc.guildId || gc.id;
            
            const guildSubChannels = (subChannels || [])
              .filter((sc: any) => sc.guildId === guildId)
              .map((sc: any) => {
                const isVoice = sc.description?.includes('VOICE') || sc.name.includes('voice');
                return {
                  id: sc.id,
                  name: sc.name,
                  type: isVoice ? ('VOICE' as const) : ('TEXT' as const),
                  guildId: guildId,
                  createdAt: sc.createdAt || sc.updatedAt
                };
              });

            const generalChannel = {
              id: gc.id,
              name: 'general',
              type: 'TEXT' as const,
              guildId: guildId,
              createdAt: gc.createdAt || gc.updatedAt
            };

            const members = (gc.participants || []).map((p: any) => ({
              id: p.id,
              username: p.username,
              email: p.email,
              avatar: p.image || undefined,
              createdAt: p.createdAt
            }));

            return {
              id: guildId,
              name: gc.name,
              ownerId: gc.admins?.[0] || '',
              createdAt: gc.createdAt || gc.updatedAt,
              channels: [generalChannel, ...guildSubChannels],
              members: members
            };
          });

          dispatch(setGuilds(mappedGuilds));
        }
      } catch (err) {
        console.error("Failed to fetch user guilds/channels:", err);
      }
    };

    fetchGuildsData();

    const mapMessage = (data: any) => {
      if (!data) return data;
      return {
        ...data,
        content: data.text,
        authorId: data.userId,
        recipientId: data.recipientId,
        author: data.user || { username: 'User' },
        parent: data.parent ? {
          ...data.parent,
          content: data.parent.text,
          authorId: data.parent.userId,
          author: data.parent.user || { username: 'User' }
        } : undefined
      };
    };

    const registerSocket = () => {
      console.log('📡 Main WS connected, registering user ID:', auth.user?.id);
      if (auth.user?.id) {
        ws.emit('register', auth.user.id);
      }
    };

    if (ws.connected) {
      registerSocket();
    }

    ws.on('connect', registerSocket);

    // Connect to WebSocket
    ws.connect();

    // Listen for events
    ws.on('MESSAGE_CREATE', (data: any) => {
      dispatch(messageCreated(mapMessage(data)));
    });

    ws.on('MESSAGE_DELETE', (data: any) => {
      dispatch(messageDeleted(data));
    });

    ws.on('MESSAGE_UPDATE', (data: any) => {
      dispatch(messageUpdated(mapMessage(data)));
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
      ws.off('connect');
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
