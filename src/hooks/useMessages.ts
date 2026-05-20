import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '~/stores/auth.store';
import { useMessageStore } from '~/stores/message.store';
import { messageAPI } from '~/lib/api/message.api';
import { socketService } from '~/lib/socket/socket.service';
import type { Message } from '~/types';

export function useMessages(channelId: string) {
  const { messagesByChannel, addMessageToChannel, setMessagesByChannel } = useMessageStore();

  // Fetch messages
  const { data, isLoading, error } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => messageAPI.getByChannelId(channelId).then((res) => res.data),
    enabled: !!channelId,
  });

  useEffect(() => {
    if (data) {
      setMessagesByChannel(channelId, data);
    }
  }, [data, channelId, setMessagesByChannel]);

  // Listen for new messages from websocket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.channelId === channelId) {
        addMessageToChannel(channelId, message);
      }
    };

    socketService.onChatMessage(handleNewMessage);

    return () => {
      socketService.removeAllListeners();
    };
  }, [channelId, addMessageToChannel]);

  const messages = messagesByChannel[channelId] || data || [];

  return { messages, isLoading, error };
}

export function useSendMessage(channelId: string) {
  const user = useAuthStore((state) => state.user);
  const { addMessageToChannel } = useMessageStore();

  return useMutation({
    mutationFn: (text: string) =>
      messageAPI.create({
        channelId,
        userId: user?.id!,
        text,
      }),
    onSuccess: (response) => {
      const message = response.data;
      addMessageToChannel(channelId, message);
      socketService.sendChatMessage(message);
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}
