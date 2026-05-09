import React from 'react';

const LoadingPage: React.FC = () => {
  const tips = [
    'Did you know? HustCord is built with React and Tailwind CSS.',
    'Pro tip: You can use the sidebar to navigate between servers.',
    'Loading your customized experience...',
    'Connecting to the HustCord network...',
  ];
  const randomIndex = Math.floor(Math.random() * tips.length);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#313338] text-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#5865f2] border-t-transparent mb-6"></div>
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        <p className="text-[#b5bac1] text-sm max-w-md mx-auto">{tips[randomIndex]}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
