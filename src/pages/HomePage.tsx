import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white p-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to HustCord</h1>
        <div className="flex gap-4">
          <Link to="/login" className="px-8 py-3 bg-white text-black font-bold rounded">Login</Link>
          <Link to="/register" className="px-8 py-3 bg-[#5865f2] text-white font-bold rounded">Register</Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;
