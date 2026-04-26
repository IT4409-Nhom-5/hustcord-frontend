import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

const LoginPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white">
        <div className="w-full max-w-md p-8 bg-[#1e1f22] rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-2 text-center">Welcome back!</h1>
          <p className="text-gray-400 text-center mb-6">We're so excited to see you again!</p>
          
          <div className="space-y-4">
              <div className="text-sm text-gray-500 italic text-center">
                  (Login form will be implemented here)
              </div>
              <Link 
                to="/register" 
                className="block text-center text-[#00a8fc] hover:underline text-sm"
              >
                Need an account? Register
              </Link>
              <Link 
                to="/" 
                className="block text-center text-gray-500 hover:text-gray-300 text-xs mt-4"
              >
                Back to Home
              </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
