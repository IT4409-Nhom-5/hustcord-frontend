import React, { type ReactNode } from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import WSListener from '../WSListener';
import CreateGuildModal from '../modals/CreateGuildModal';
import CreateChannelModal from '../modals/CreateChannelModal';

export interface PageWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageTitle?: string;
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ pageTitle = 'HustCord', children, className, ...rest }) => {
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  
  return (
    <div className={`page-wrapper h-screen w-full overflow-hidden ${className || ''}`} {...rest}>
      {children}
      
      <WSListener />

      {/* Global Modals */}
      {activeModal === 'CREATE_GUILD' && <CreateGuildModal />}
      {activeModal === 'CREATE_CHANNEL' && <CreateChannelModal />}
    </div>
  );
};

export default PageWrapper;
