import React, { useState } from 'react';
import Modal from './Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { channelCreated } from '../../store/slices/guildSlice';
import { closedModal } from '../../store/slices/uiSlice';
import type { Channel } from '../../types';
import api from '../../services/api';

const CreateChannelModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeGuildId = useAppSelector((state) => state.ui.activeGuildId);
  const [name, setName] = useState('');
  const [type, setType] = useState<'TEXT' | 'VOICE'>('TEXT');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeGuildId) {
      if (!activeGuildId) alert("Please select a server first.");
      return;
    }

    setLoading(true);
    try {
      // Gọi API tạo channel thật ở Backend
      const response = await api.post('/channels', {
        name: name.trim(),
        description: `${type} channel in guild`,
        participants: [], 
        admins: [],
        image: '',
        guildId: activeGuildId
      });

      if (response.data.channel) {
        const backendChannel = response.data.channel;
        const formattedName = type === 'TEXT' 
          ? name.trim().toLowerCase().replace(/\s+/g, '-')
          : name.trim();

        const newChannel: Channel = {
          id: backendChannel.id, // Dùng ID thật từ Backend (là UUID)
          name: formattedName,
          type: type,
          guildId: activeGuildId,
          createdAt: backendChannel.createdAt
        };

        dispatch(channelCreated({ guildId: activeGuildId, channel: newChannel }));
        dispatch(closedModal());
      } else {
        alert("Server returned success but no channel data.");
      }
    } catch (error: any) {
      console.error("Failed to create channel in backend:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to create channel: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Channel">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">Channel Name</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-[#80848e] text-lg">
              {type === 'TEXT' ? '#' : (
                <svg className="w-5 h-5 mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm-4-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
              )}
            </span>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'TEXT' ? "new-channel" : "General Voice"}
              className="w-full bg-[#1e1f22] text-[#dbdee1] p-2 pl-10 rounded outline-none focus:ring-1 focus:ring-[#5865f2]"
              autoFocus
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

        <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-[#b5bac1] uppercase">Channel Type</label>
          <div 
            onClick={() => setType('TEXT')}
            className={`p-3 rounded flex items-center cursor-pointer transition-colors ${type === 'TEXT' ? 'bg-[#3f4147] text-white' : 'hover:bg-[#35373c] text-[#b5bac1]'}`}
          >
            <span className="text-2xl mr-3">#</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Text</span>
              <span className="text-xs opacity-70">Send messages, images, and emojis</span>
            </div>
          </div>
          <div 
            onClick={() => setType('VOICE')}
            className={`p-3 rounded flex items-center cursor-pointer transition-colors ${type === 'VOICE' ? 'bg-[#3f4147] text-white' : 'hover:bg-[#35373c] text-[#b5bac1]'}`}
          >
            <span className="text-2xl mr-3">🔊</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Voice</span>
              <span className="text-xs opacity-70">Hang out with voice, video, and screen share</span>
            </div>
          </div>
        </div>

        <div className="bg-[#2b2d31] -mx-4 p-4 mt-2 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => dispatch(closedModal())}
            className="text-white text-sm font-medium hover:underline px-4 py-2"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className={`bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium px-6 py-2 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating..." : "Create Channel"}
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
