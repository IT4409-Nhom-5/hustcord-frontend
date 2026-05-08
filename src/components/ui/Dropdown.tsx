import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean; // Nếu true, chữ sẽ màu đỏ và hover nền đỏ
  divider?: boolean; // Dùng để tạo vạch kẻ ngăn cách
}

export interface DropdownProps {
  trigger: React.ReactNode; // Phần tử người dùng click vào để mở menu
  items: DropdownItem[];
  onSelect: (id: string) => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  position = 'bottom-left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lắng nghe sự kiện click ra ngoài để tự động đóng Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Map vị trí Dropdown
  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1',
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer w-full">
        {trigger}
      </div>

      {isOpen && (
        <div className={`absolute z-50 w-56 rounded bg-[#111214] p-1.5 shadow-lg ${positionClasses[position]}`}>
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={`divider-${index}`} className="my-1 h-px bg-[#2b2d31]" />;
            }
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-[2px] px-2 py-1.5 text-sm font-medium transition-colors ${
                  item.danger
                    ? 'text-[#da373c] hover:bg-[#da373c] hover:text-white'
                    : 'text-[#b5bac1] hover:bg-[#5865F2] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.icon && <span className="ml-2">{item.icon}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
