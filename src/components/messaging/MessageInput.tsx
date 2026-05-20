import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createMessageSchema, type CreateMessageInput } from '~/lib/validation/schemas';
import { messageAPI } from '~/lib/api/message.api';
import { useMessageStore } from '~/stores/message.store';
import { useAuthStore } from '~/stores/auth.store';
import { socketService } from '~/lib/socket/socket.service';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  channelId: string;
}

export default function MessageInput({ channelId }: MessageInputProps) {
  const user = useAuthStore((state) => state.user);
  const { addMessageToChannel } = useMessageStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateMessageInput) =>
      messageAPI.create({
        channelId,
        userId: user?.id!,
        text: data.text,
        images: data.images,
      }),
    onSuccess: (response) => {
      const message = response.data;
      addMessageToChannel(channelId, message);
      socketService.sendChatMessage(message);
      reset();
    },
    onError: (error: any) => {
      toast.error('Failed to send message');
      console.error(error);
    },
  });

  const onSubmit = (data: CreateMessageInput) => {
    sendMessageMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 border-t border-gray-800">
      <div className="flex gap-3">
        {/* File input */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition flex-shrink-0"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message input */}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Message #channel..."
            {...register('text')}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending}
            className="p-2 text-gray-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      {errors.text && (
        <p className="mt-1 text-xs text-red-400">{errors.text.message}</p>
      )}
    </form>
  );
}
