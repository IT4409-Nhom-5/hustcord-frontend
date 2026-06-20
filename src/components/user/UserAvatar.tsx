import React from 'react';

// Function to detect default profile placeholder avatars
export const isDefaultAvatar = (url?: string) => {
  if (!url) return true;
  return (
    url.includes('noavatar') || 
    url.includes('noavatar_rxbrbk.png') || 
    url.includes('gravatar.com')
  );
};

// Color map based on the first letter of the username
export const getAvatarBgColor = (username?: string) => {
  if (!username) return '#5865f2';
  const char = username.charAt(0).toUpperCase();
  const colors: Record<string, string> = {
    A: '#f23f43', B: '#23a55a', C: '#5865f2', D: '#f0b232', E: '#eb459e',
    F: '#99aab5', G: '#1abc9c', H: '#e67e22', I: '#9b59b6', J: '#34495e',
    K: '#16a085', L: '#27ae60', M: '#2980b9', N: '#8e44ad', O: '#2c3e50',
    P: '#d35400', Q: '#7f8c8d', R: '#bdc3c7', S: '#c0392b', T: '#117a65',
    U: '#6c3483', V: '#1f618d', W: '#d4ac0d', X: '#a04000', Y: '#7d6608',
    Z: '#1b4f72'
  };
  return colors[char] || '#5865f2';
};

interface UserAvatarProps {
  user?: {
    username: string;
    avatarURL?: string;
    avatar?: string;
    image?: string;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xlg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const avatarUrl = user?.avatarURL || user?.avatar || user?.image;
  const username = user?.username || 'User';
  const showLetter = !avatarUrl || isDefaultAvatar(avatarUrl);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-base',
    xlg: 'w-10 h-10 text-lg',
    xl: 'w-[68px] h-[68px] text-3xl'
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-bold overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: getAvatarBgColor(username) }}
    >
      {!showLetter ? (
        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
      ) : (
        username.charAt(0).toUpperCase()
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
