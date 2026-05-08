import React, { useState } from 'react';

export interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'idle' | 'dnd';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, size = 'md', status }) => {
  const [imageError, setImageError] = useState(false);

  // Ánh xạ kích thước của Avatar
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  // Ánh xạ kích thước của Badge Status
  const statusSizes = {
    sm: 'h-2.5 w-2.5 border-[2px]',
    md: 'h-3 w-3 border-[3px]',
    lg: 'h-3.5 w-3.5 border-[3px]',
  };

  // Ánh xạ màu sắc của Badge Status (sử dụng mã màu giống Discord)
  const statusColors = {
    online: 'bg-[#23a55a]',
    offline: 'bg-[#80848e]',
    idle: 'bg-[#f0b232]',
    dnd: 'bg-[#f23f43]',
  };

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const showImage = src && !imageError;

  return (
    <div className="relative inline-block">
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} flex select-none items-center justify-center rounded-full bg-indigo-500 font-semibold text-white`}>
          {initial}
        </div>
      )}

      {status && (
        <div
          className={`absolute bottom-0 right-0 rounded-full border-[#232428] ${statusSizes[size]} ${statusColors[status]}`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
