import React, { useState } from 'react';
import Modal from './Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { channelCreated } from '../../store/slices/guildSlice';
import { closedModal } from '../../store/slices/uiSlice';

const CreateChannelModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeGuildId = useAppSelector((state) => state.ui.activeGuild?.id);
  const [name, setName] = useState('');
  const [type, setType] = useState<'text' | 'voice'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeGuildId) return;

    const newChannel = {
      id: Date.now().toString(),
      name: name.trim().toLowerCase().replace(/\s+/g, '-'),
      type
    };

    dispatch(channelCreated({ guildId: activeGuildId, channel: newChannel }));
    dispatch(closedModal());
  };

  return (
    <Modal title="Create Channel">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">Channel Name</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#80848e] text-xl">#</span>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="new-channel"
              className="w-full bg-[#1e1f22] text-[#dbdee1] p-2 pl-8 rounded outline-none focus:ring-1 focus:ring-[#5865f2]"
              autoFocus
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-[#b5bac1] uppercase">Channel Type</label>
          <div 
            onClick={() => setType('text')}
            className={`p-3 rounded flex items-center cursor-pointer transition-colors ${type === 'text' ? 'bg-[#3f4147] text-white' : 'hover:bg-[#35373c] text-[#b5bac1]'}`}
          >
            <span className="text-2xl mr-3">#</span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Text</span>
              <span className="text-xs opacity-70">Send messages, images, and emojis</span>
            </div>
          </div>
          <div 
            onClick={() => setType('voice')}
            className={`p-3 rounded flex items-center cursor-pointer transition-colors ${type === 'voice' ? 'bg-[#3f4147] text-white' : 'hover:bg-[#35373c] text-[#b5bac1]'}`}
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
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium px-6 py-2 rounded transition-colors"
          >
            Create Channel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
