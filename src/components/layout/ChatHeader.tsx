import { useQuery } from '@tanstack/react-query';
import { channelAPI } from '~/lib/api/channel.api';
import { Hash, Phone, Video, Settings } from 'lucide-react';

interface ChatHeaderProps {
  channelId: string;
}

export default function ChatHeader({ channelId }: ChatHeaderProps) {
  const { data: channel } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => channelAPI.getById(channelId).then((res) => res.data),
  });

  if (!channel) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-3">
        <Hash className="w-5 h-5 text-gray-400" />
        <div>
          <h2 className="font-semibold text-white">{channel.name}</h2>
          {channel.description && (
            <p className="text-xs text-gray-400">{channel.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
