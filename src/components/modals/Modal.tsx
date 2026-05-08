import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Hỗ trợ đóng Modal khi ấn phím ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* Lớp nền đen, click ra ngoài để đóng */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Nội dung Modal */}
      <div className="relative z-10 w-full max-w-[440px] rounded-lg bg-[#313338] shadow-2xl">
        {title && (
          <div className="px-4 py-4 text-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#80848e] transition hover:text-[#dbdee1]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
