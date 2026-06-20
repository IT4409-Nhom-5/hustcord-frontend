import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarIconProps {
  to?: string;
  imageURL?: string;
  name: string;
  isAction?: boolean;
  onClick?: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ to, imageURL, name, isAction, onClick }) => {
  const location = useLocation();
  const isActive = to ? location.pathname.startsWith(to) : false;

  const content = imageURL ? (
    <img src={imageURL} alt={name} className="w-full h-full object-cover" />
  ) : (
    <span className="text-xl font-medium">{isAction ? '+' : name.charAt(0)}</span>
  );

  const wrapperClass = `
    relative flex items-center justify-center w-12 h-12 mb-2 mx-auto
    bg-[#313338] hover:bg-[#5865f2] text-[#dbdee1] hover:text-white
    cursor-pointer transition-all duration-200 overflow-hidden group
    ${isActive ? 'bg-[#5865f2] text-white rounded-2xl' : 'rounded-[24px] hover:rounded-2xl'}
    ${isAction ? 'text-[#23a559] bg-[#313338] hover:bg-[#23a559] hover:text-white' : ''}
  `;

  // Pill indicator on the left
  const indicatorClass = `
    absolute left-0 w-2 bg-white rounded-r-md transition-all duration-200
    ${isActive ? 'h-10 opacity-100' : 'h-5 opacity-0 group-hover:opacity-100'}
  `;

  const Inner = () => (
    <div className="relative w-full" onClick={onClick}>
      <div className={indicatorClass} />
      <div className={wrapperClass}>
        {content}
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-[76px] top-1/2 -translate-y-1/2 bg-[#111214] text-[#dbdee1] text-sm font-semibold px-3 py-1.5 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
        {name}
        {/* Tooltip arrow */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-[#111214]"></div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="w-full"><Inner /></Link>;
  }
  
  return <Inner />;
};

export default SidebarIcon;
