import React from 'react';
import { useAppSelector } from '../../../hooks/useAppStore';

const MemberList: React.FC = () => {
  const users = useAppSelector((state) => state.users.list);
  
  // Use fake data if no users exist in state yet
  const displayUsers = users.length > 0 ? users : [
    { id: '1', username: 'Wumpus', status: 'online' },
    { id: '2', username: 'Clyde', status: 'offline' }
  ];

  return (
    <div className="w-[240px] bg-[#2b2d31] flex flex-col shrink-0">
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-xs font-semibold text-[#b5bac1] uppercase tracking-wide">
          Members — {displayUsers.length}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2 hide-scrollbar">
        {displayUsers.map((user: any) => (
          <div key={user.id} className="flex items-center px-2 py-1.5 hover:bg-[#35373c] rounded cursor-pointer group mb-[2px]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-medium overflow-hidden">
                {user.avatarURL ? (
                  <img src={user.avatarURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.username.charAt(0)
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-[2.5px] border-[#2b2d31] rounded-full group-hover:border-[#35373c] ${user.status === 'offline' ? 'bg-[#80848e]' : 'bg-[#23a559]'}`}></div>
            </div>
            <span className="ml-3 font-medium text-[#949ba4] group-hover:text-[#dbdee1] truncate">
              {user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
