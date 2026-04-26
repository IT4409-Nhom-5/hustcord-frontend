import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#313338] text-white overflow-hidden relative">
      {children}
    </div>
  );
};

export default PageWrapper;
