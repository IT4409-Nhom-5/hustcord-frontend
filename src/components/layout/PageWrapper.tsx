import React, { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import WSListener from '../WSListener';
import CreateGuildModal from '../modals/CreateGuildModal';
import CreateChannelModal from '../modals/CreateChannelModal';
import CallOverlay from '../channel/CallOverlay';
import CallManager from '../channel/CallManager';
import { setSidebarOpen, setMemberListOpen } from '../../store/slices/uiSlice';

export interface PageWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageTitle?: string;
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ pageTitle = 'HustCord', children, className, ...rest }) => {
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const activeCall = useAppSelector((state) => state.ui.activeCall);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setSidebarOpen(false));
    dispatch(setMemberListOpen(false));
  }, [location.pathname, dispatch]);
  
  return (
    <div className={`page-wrapper h-screen w-full overflow-hidden ${className || ''}`} {...rest}>
      {children}
      
      <WSListener />
      <CallManager />

      {/* Global Overlays & Modals */}
      {activeCall && <CallOverlay />}
      
      {activeModal === 'CREATE_GUILD' && <CreateGuildModal />}
      {activeModal === 'CREATE_CHANNEL' && <CreateChannelModal />}
    </div>
  );
};

export default PageWrapper;
