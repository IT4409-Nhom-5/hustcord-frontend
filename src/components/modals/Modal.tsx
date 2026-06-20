import React, { type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { closedModal } from '../../store/slices/uiSlice';

interface ModalProps {
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, title }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closedModal());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-[2px]">
      <div 
        className="bg-[#313338] w-full max-w-[440px] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={handleClose}
            className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-2">
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
