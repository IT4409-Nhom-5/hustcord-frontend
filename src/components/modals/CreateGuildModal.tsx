import React, { useState } from 'react';
import Modal from './Modal';
// import { useAppDispatch } from '../../hooks/useAppStore';
// import { createGuild } from '../../store/slices/guildSlice'; // TODO: Cần tạo thunk này

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGuildModal: React.FC<CreateGuildModalProps> = ({ isOpen, onClose }) => {
  const [guildName, setGuildName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  // const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildName.trim()) return;

    // TODO: Dispatch action tạo Server mới (Gọi API qua Redux Thunk)
    // dispatch(createGuild({ name: guildName, icon: iconUrl }));
    console.log('Tạo server mới:', { name: guildName, icon: iconUrl });

    setGuildName('');
    setIconUrl('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo máy chủ của bạn">
      <div className="mb-4 text-center text-sm text-[#b5bac1]">
        Máy chủ là nơi bạn và những người bạn của mình gặp gỡ. Hãy tạo một máy chủ và bắt đầu trò chuyện.
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
            Tên máy chủ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
            placeholder="Máy chủ của tôi"
            className="w-full rounded bg-[#1e1f22] px-3 py-2.5 text-white outline-none focus:ring-1 focus:ring-[#5865F2]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase text-[#8e9297]">
            Đường dẫn ảnh đại diện (Tùy chọn)
          </label>
          <input
            type="url"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.png"
            className="w-full rounded bg-[#1e1f22] px-3 py-2.5 text-white outline-none focus:ring-1 focus:ring-[#5865F2]"
          />
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
            disabled={!guildName.trim()}
            className="rounded bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tạo
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGuildModal;
