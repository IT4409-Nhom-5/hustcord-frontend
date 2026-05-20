import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useChannelStore } from '~/stores/channel.store';
import { channelAPI } from '~/lib/api/channel.api';
import type { Channel } from '~/types';

export function useChannels(userId: string) {
  const { channels, setChannels } = useChannelStore();

  const { isLoading, error } = useQuery({
    queryKey: ['channels', userId],
    queryFn: () => channelAPI.getByUserId(userId).then((res) => res.data),
    enabled: !!userId,
    onSuccess: (data) => setChannels(data),
  });

  return { channels, isLoading, error };
}

export function useCreateChannel() {
  const { addChannel } = useChannelStore();

  return useMutation({
    mutationFn: (data: Partial<Channel>) => channelAPI.create(data),
    onSuccess: (response) => {
      const channel = response.data;
      addChannel(channel);
      toast.success('Channel created successfully');
    },
    onError: () => {
      toast.error('Failed to create channel');
    },
  });
}

export function useUpdateChannel(channelId: string) {
  const { updateChannel } = useChannelStore();

  return useMutation({
    mutationFn: (data: Partial<Channel>) => channelAPI.update(channelId, data),
    onSuccess: (response) => {
      updateChannel(channelId, response.data);
      toast.success('Channel updated successfully');
    },
    onError: () => {
      toast.error('Failed to update channel');
    },
  });
}

export function useDeleteChannel() {
  const { deleteChannel } = useChannelStore();

  return useMutation({
    mutationFn: (channelId: string) => channelAPI.delete(channelId),
    onSuccess: (_, channelId) => {
      deleteChannel(channelId);
      toast.success('Channel deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete channel');
    },
  });
}
