import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppStore';
import Modal from './Modal';
import { created } from '../../store/slices/guildSlice';
import { closedModal } from '../../store/slices/uiSlice';

const CreateGuildModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuild = {
      id: Date.now().toString(),
      name: name.trim(),
      channels: [{ id: 'general', name: 'general', type: 'text' }],
      members: []
    };

    dispatch(created({ guild: newGuild }));
    dispatch(closedModal());
  };

  return (
    <Modal title="Customize your server">
      <div className="text-center mb-6 px-4">
        <p className="text-[#b5bac1] text-sm">
          Give your new server a personality with a name and an icon. You can always change it later.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#4e5058] flex items-center justify-center text-[#b5bac1] hover:border-[#5865f2] hover:text-[#5865f2] cursor-pointer transition-colors group">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm-1-13h2v4h4v2h-4v4h-2v-4H7v-2h4V7Z"/></svg>
              <span className="text-[10px] font-bold uppercase">Upload</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">Server Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Cool Server"
            className="w-full bg-[#1e1f22] text-[#dbdee1] p-2 rounded outline-none focus:ring-1 focus:ring-[#5865f2]"
            autoFocus
          />
          <p className="text-[11px] text-[#80848e] mt-2">
            By creating a server, you agree to HustCord's <span className="text-[#00a8fc] cursor-pointer hover:underline">Community Guidelines</span>.
          </p>
        </div>

        <div className="bg-[#2b2d31] -mx-4 p-4 mt-2 flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => dispatch(closedModal())}
            className="text-white text-sm font-medium hover:underline px-4 py-2"
          >
            Back
          </button>
          <button 
            type="submit"
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium px-8 py-2 rounded transition-colors shadow-lg"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGuildModal;
