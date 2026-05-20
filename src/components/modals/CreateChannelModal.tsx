import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import Modal from './Modal';
import { useUIStore } from '~/stores/ui.store';
import { useChannelStore } from '~/stores/channel.store';
import { channelAPI } from '~/lib/api/channel.api';

const CreateChannelModal = () => {
  const { createChannelModalOpen, setCreateChannelModalOpen } = useUIStore();
  const { addChannel } = useChannelStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createChannelMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      channelAPI.create(data),
    onSuccess: (response) => {
      if (response.data) {
        addChannel(response.data);
        toast.success('Channel created successfully!');
        setCreateChannelModalOpen(false);
        setName('');
        setDescription('');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create channel';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Channel name is required');
      return;
    }
    createChannelMutation.mutate({ name: name.trim(), description });
  };

  return (
    <Modal
      title="Create Channel"
      isOpen={createChannelModalOpen}
      onClose={() => setCreateChannelModalOpen(false)}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Channel Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. announcements"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
            disabled={createChannelMutation.isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this channel about?"
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            disabled={createChannelMutation.isPending}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={() => setCreateChannelModalOpen(false)}
            className="px-4 py-2 text-gray-300 hover:text-white transition"
            disabled={createChannelMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createChannelMutation.isPending}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {createChannelMutation.isPending ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
