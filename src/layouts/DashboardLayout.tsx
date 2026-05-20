import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '~/stores/auth.store';
import { useChannelStore } from '~/stores/channel.store';
import Sidebar from '~/components/layout/Sidebar';
import ChannelView from '~/pages/ChannelView';
import DirectMessagesView from '~/pages/DirectMessagesView';
import CreateChannelModal from '~/components/modals/CreateChannelModal';

export default function DashboardLayout() {
  const { '*': path } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { channels, setChannels } = useChannelStore();

  useEffect(() => {
    // Load user's channels when component mounts
    if (user?.id) {
      // TODO: Fetch channels from API
      // For now, channels will be managed through message/channel events
    }
  }, [user?.id]);

  // Route to appropriate view based on path
  if (!path) {
    navigate('/channels/@me');
    return null;
  }

  const isDirectMessage = path?.startsWith('@me');

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Routes>
        <Route path="@me/*" element={<DirectMessagesView />} />
        <Route path=":channelId" element={<ChannelView />} />
      </Routes>

      {/* Modals */}
      <CreateChannelModal />
    </div>
  );
}
