import React, { useState } from 'react';
import Modal from './Modal';
import { ChannelType } from '../../types';
// import { useAppDispatch } from '../../hooks/useAppStore';
// import { createChannel } from '../../store/slices/guildSlice'; // TODO: Cần tạo thunk này

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  guildId?: string; // Dùng để biết tạo channel cho server nào
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, guildId }) => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>(ChannelType.TEXT);
  // const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    // TODO: Dispatch action tạo channel (Gọi API qua Redux Thunk)
    // dispatch(createChannel({ guildId, name: channelName, type: channelType }));
    console.log('Tạo channel mới:', { guildId, name: channelName, type: channelType });

    setChannelName('');
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Discord tự động thay khoảng trắng thành dấu gạch ngang và viết thường tên kênh
    const formattedName = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setChannelName(formattedName);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo kênh">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
            Loại kênh
          </label>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center rounded bg-[#2b2d31] p-3 hover:bg-[#3f4147]">
              <input
                type="radio"
                name="channelType"
                checked={channelType === ChannelType.TEXT}
                onChange={() => setChannelType(ChannelType.TEXT)}
                className="mr-3 h-4 w-4 text-[#5865F2] focus:ring-[#5865F2]"
              />
              <div className="flex flex-col">
                <span className="font-medium text-white">Kênh văn bản</span>
                <span className="text-xs text-[#80848e]">Gửi tin nhắn, hình ảnh, GIF, emoji, ý kiến, và các trò đùa</span>
              </div>
            </label>
            <label className="flex cursor-pointer items-center rounded bg-[#2b2d31] p-3 hover:bg-[#3f4147]">
              <input
                type="radio"
                name="channelType"
                checked={channelType === ChannelType.VOICE}
                onChange={() => setChannelType(ChannelType.VOICE)}
                className="mr-3 h-4 w-4 text-[#5865F2] focus:ring-[#5865F2]"
              />
              <div className="flex flex-col">
                <span className="font-medium text-white">Kênh thoại</span>
                <span className="text-xs text-[#80848e]">Cùng nhau trò chuyện bằng giọng nói, video, hoặc chia sẻ màn hình</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-2">
          <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
            Tên kênh
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#80848e]">
              {channelType === ChannelType.TEXT ? '#' : '🔊'}
            </span>
            <input
              type="text"
              value={channelName}
              onChange={handleNameChange}
              placeholder="kênh-mới"
              className="w-full rounded bg-[#1e1f22] py-2.5 pl-8 pr-3 text-white outline-none focus:ring-1 focus:ring-[#5865F2]"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#1e1f22] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white transition hover:underline"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!channelName.trim()}
            className="rounded bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tạo kênh
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
