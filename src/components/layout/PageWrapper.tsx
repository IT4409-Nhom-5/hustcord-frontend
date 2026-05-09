import React, { type ReactNode } from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import WSListener from '../WSListener';
import CreateGuildModal from '../modals/CreateGuildModal';
import CreateChannelModal from '../modals/CreateChannelModal';
import CallOverlay from '../channel/CallOverlay';

export interface PageWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageTitle?: string;
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ pageTitle = 'HustCord', children, className, ...rest }) => {
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const activeCall = useAppSelector((state) => state.ui.activeCall);
  
  return (
    <div className={`page-wrapper h-screen w-full overflow-hidden ${className || ''}`} {...rest}>
      {children}
      
      <WSListener />

      {/* Global Overlays & Modals */}
      {activeCall && <CallOverlay />}
      
      {activeModal === 'CREATE_GUILD' && <CreateGuildModal />}
      {activeModal === 'CREATE_CHANNEL' && <CreateChannelModal />}
    </div>
  );
};

export default PageWrapper;
