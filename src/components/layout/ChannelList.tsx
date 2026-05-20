import { useNavigate } from 'react-router-dom';
import { useChannelStore } from '~/stores/channel.store';
import type { Channel } from '~/types';
import { Hash, MessageCircle, Loader2 } from 'lucide-react';

interface ChannelListProps {
  channels: Channel[];
  isLoading: boolean;
}

export default function ChannelList({ channels, isLoading }: ChannelListProps) {
  const navigate = useNavigate();
  const { activeChannelId, setActiveChannelId } = useChannelStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-2 py-4 space-y-1">
      {/* Direct Messages */}
      <button
        onClick={() => {
          setActiveChannelId(null);
          navigate('/channels/@me');
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Direct Messages</span>
      </button>

      {/* Channels Header */}
      {channels.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Channels
          </p>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                setActiveChannelId(channel.id || '');
                navigate(`/channels/${channel.id}`);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                activeChannelId === channel.id
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span className="text-sm font-medium truncate">{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {channels.length === 0 && (
        <div className="mt-8 text-center text-gray-400 text-sm">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No channels yet</p>
        </div>
      )}
    </div>
  );
}
