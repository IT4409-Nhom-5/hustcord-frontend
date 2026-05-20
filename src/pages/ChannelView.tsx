import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMessageStore } from '~/stores/message.store';
import { messageAPI } from '~/lib/api/message.api';
import MessageList from '~/components/messaging/MessageList';
import MessageInput from '~/components/messaging/MessageInput';
import ChatHeader from '~/components/layout/ChatHeader';

export default function ChannelView() {
  const { channelId } = useParams();
  const { messagesByChannel } = useMessageStore();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => messageAPI.getByChannelId(channelId!).then((res) => res.data),
    enabled: !!channelId,
  });

  if (!channelId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-850">
      {/* Header */}
      <ChatHeader channelId={channelId} />

      {/* Messages */}
      <MessageList
        messages={messagesByChannel[channelId] || messages}
        isLoading={isLoading}
      />

      {/* Input */}
      <MessageInput channelId={channelId} />
    </div>
  );
}
