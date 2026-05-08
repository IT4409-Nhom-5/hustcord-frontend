import React from 'react';
import UserAvatar from './UserAvatar';

// Định nghĩa kiểu dữ liệu cho Mock Data
interface MockMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
}

// Dữ liệu giả lập để test UI
const mockMembers: MockMember[] = [
  { id: '1', name: 'Chung.DQ', avatar: 'https://i.pravatar.cc/150?u=1', status: 'online' },
  { id: '2', name: 'HustCoder', status: 'idle' },
  { id: '3', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=3', status: 'dnd' },
  { id: '4', name: 'Bob', status: 'offline' },
  { id: '5', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=5', status: 'offline' },
];

const MemberList: React.FC = () => {
  // Phân loại danh sách (Những ai không phải offline thì cho vào nhóm ONLINE)
  const onlineMembers = mockMembers.filter((m) => m.status !== 'offline');
  const offlineMembers = mockMembers.filter((m) => m.status === 'offline');

  // Hàm render giao diện cho từng dòng user
  const renderMemberItem = (member: MockMember) => (
    <div
      key={member.id}
      className="group mb-[2px] flex cursor-pointer items-center rounded-md px-2 py-1.5 transition-colors hover:bg-[#3f4147]"
    >
      <UserAvatar
        src={member.avatar}
        name={member.name}
        size="md"
        status={member.status}
      />
      <div className="ml-3 flex-1 overflow-hidden">
        <div
          className={`truncate font-medium leading-5 transition-colors ${
            member.status === 'offline'
              ? 'text-[#80848e] group-hover:text-[#dbdee1]'
              : 'text-[#dbdee1] group-hover:text-white'
          }`}
        >
          {member.name}
        </div>
      </div>
    </div>
  );

  return (
    <aside className="custom-scrollbar flex w-60 flex-shrink-0 flex-col overflow-y-auto bg-[#2b2d31] pt-6">
      {/* Nhóm ONLINE */}
      {onlineMembers.length > 0 && (
        <div className="mb-6 px-4">
          <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8e9297]">
            Trực tuyến — {onlineMembers.length}
          </h3>
          <div className="space-y-1">{onlineMembers.map(renderMemberItem)}</div>
        </div>
      )}

      {/* Nhóm OFFLINE */}
      {offlineMembers.length > 0 && (
        <div className="mb-6 px-4">
          <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8e9297]">
            Ngoại tuyến — {offlineMembers.length}
          </h3>
          <div className="space-y-1">{offlineMembers.map(renderMemberItem)}</div>
        </div>
      )}
    </aside>
  );
};

export default MemberList;
