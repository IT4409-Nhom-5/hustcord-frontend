import { useAuthStore } from '~/stores/auth.store';
import { MessageCircle } from 'lucide-react';

export default function DirectMessagesView() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-850 text-center">
      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Direct Messages</h2>
      <p className="text-gray-400">Select a conversation or start a new one</p>
    </div>
  );
}
