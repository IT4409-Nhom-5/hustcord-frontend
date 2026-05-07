import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#404eed] font-sans relative overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center space-x-2 text-white font-bold text-xl cursor-pointer">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>
          <span>HustCord</span>
        </div>
        <div className="hidden md:flex space-x-8 text-white font-medium">
          <a href="#" className="hover:underline">Download</a>
          <a href="#" className="hover:underline">Nitro</a>
          <a href="#" className="hover:underline">Discover</a>
          <a href="#" className="hover:underline">Safety</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
        <div>
          <Link to="/login" className="bg-white text-[#23272a] px-4 py-2.5 rounded-full font-medium hover:text-[#5865f2] hover:shadow-lg transition-all text-sm">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center relative z-10 text-center px-4 pt-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight uppercase" style={{ fontFamily: "'Ginto Nord', 'Inter', sans-serif" }}>
            IMAGINE A PLACE...
          </h1>
          <p className="text-lg md:text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
            ...where you can belong to a school club, a gaming group, or a worldwide art community. 
            Where just you and a handful of friends can spend time together. A place that makes it easy 
            to talk every day and hang out more often.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#23272a] font-medium text-lg rounded-full hover:text-[#5865f2] hover:shadow-xl transition-all flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download for Windows
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-[#23272a] text-white font-medium text-lg rounded-full hover:bg-[#36393f] hover:shadow-xl transition-all"
            >
              Open HustCord in your browser
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements (Simple shapes for now instead of complex SVG scenes) */}
      <div className="absolute bottom-0 w-full flex justify-between pointer-events-none opacity-50 z-0">
        <div className="w-[40vw] h-[30vw] bg-[url('https://discord.com/assets/8a8375ab7908384e1fd6efa0cd82d566.svg')] bg-no-repeat bg-contain bg-bottom" style={{ backgroundSize: '100%' }}></div>
        <div className="w-[40vw] h-[30vw] bg-[url('https://discord.com/assets/c40c84ca18d84633a9d86b4046a91437.svg')] bg-no-repeat bg-contain bg-bottom" style={{ backgroundSize: '100%' }}></div>
      </div>
    </div>
  );
};

export default HomePage;
