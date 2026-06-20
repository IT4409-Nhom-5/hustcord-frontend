import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

const NotFoundPage: React.FC = () => {
  return (
    <PageWrapper
      className="relative w-screen h-screen bg-[#313338] text-white flex flex-col items-center justify-center"
      pageTitle="HustCord | Not Found"
    >
      <div className="text-center z-10">
        <h1 className="text-6xl font-bold mb-4 text-[#5865f2]">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-[#b5bac1] mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link 
          to="/"
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8 py-3 rounded-full font-medium transition-colors"
        >
          Return Home
        </Link>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[800px] h-[800px] border-[40px] border-[#5865f2] rounded-full blur-3xl"></div>
      </div>
    </PageWrapper>
  );
};

export default NotFoundPage;
