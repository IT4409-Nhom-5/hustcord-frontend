import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '~/stores/auth.store';
import { useChannelStore } from '~/stores/channel.store';
import { channelAPI } from '~/lib/api/channel.api';
import { useUIStore } from '~/stores/ui.store';
import ChannelList from '~/components/layout/ChannelList';
import UserProfile from '~/components/layout/UserProfile';
import { Menu, Plus } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { channels, setChannels } = useChannelStore();
  const { sidebarOpen, toggleSidebar, setCreateChannelModalOpen } = useUIStore();

  const { data: channelsData, isLoading } = useQuery({
    queryKey: ['channels', user?.id],
    queryFn: () =>
      user ? channelAPI.getByUserId(user.id).then((res) => res.data) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (channelsData) {
      setChannels(channelsData);
    }
  }, [channelsData, setChannels]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-800 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static top-0 left-0 h-screen w-60 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 z-40`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white truncate">HustCord</h1>
            <button
              onClick={() => setCreateChannelModalOpen(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
              title="Create channel"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <ChannelList channels={channels} isLoading={isLoading} />
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-4">
          <UserProfile user={user} />
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
