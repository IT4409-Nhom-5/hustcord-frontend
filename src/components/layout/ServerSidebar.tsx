import React from 'react';

interface ServerIconProps {
  active?: boolean;
  isGreen?: boolean;
  label?: string;
  image?: string;
}

const ServerIcon: React.FC<ServerIconProps> = ({ active, isGreen, label, image }) => (
  <div className="relative group flex items-center justify-center w-full mb-2">
    <div className={`absolute left-0 w-1 bg-white rounded-r-lg transition-all duration-200 
      ${active ? 'h-10' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'}`} 
    />
    <div className={`
      w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 font-medium overflow-hidden
      ${active ? 'rounded-[16px] bg-[#5865f2] text-white' : 
        isGreen ? 'rounded-[24px] bg-[#313338] text-[#23a55a] hover:rounded-[16px] hover:bg-[#23a55a] hover:text-white' :
        'rounded-[24px] bg-[#313338] text-[#dbdee1] hover:rounded-[16px] hover:bg-[#5865f2] hover:text-white'}
    `}>
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-cover" />
      ) : (
        label
      )}
    </div>
  </div>
);

const ServerSidebar: React.FC = () => {
  return (
    <nav className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 flex-shrink-0 z-20">
      {/* Nút Home (Direct Messages) */}
      <ServerIcon active label="H" />
      
      {/* Đường phân cách */}
      <div className="w-8 h-[2px] bg-[#35363c] rounded-lg mb-2" />
      
      {/* Danh sách Server giả lập */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center">
        <ServerIcon label="CS" />
        <ServerIcon label="LO" />
        <ServerIcon label="JS" />
        
        {/* Nút thêm server mới */}
        <ServerIcon isGreen label="+" />
      </div>
    </nav>
  );
};

export default ServerSidebar;
