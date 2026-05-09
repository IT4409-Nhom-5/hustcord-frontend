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
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
