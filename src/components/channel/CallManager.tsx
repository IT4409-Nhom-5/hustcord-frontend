import React from 'react';
import { useAppSelector } from '../../hooks/useAppStore';
import { useCall } from '../../context/CallContext';

const CallManager: React.FC = () => {
  const incomingCall = useAppSelector((state) => state.ui.incomingCall);
  const friends = useAppSelector((state) => state.auth.friends);
  const { acceptIncomingCall, rejectIncomingCall } = useCall();

  if (!incomingCall) return null;

  const friend = friends.find(f => f.id === incomingCall.from);
  const friendName = friend?.username || (incomingCall.from === '550e8400-e29b-41d4-a716-446655440000' ? 'Wumpus' : incomingCall.from === '550e8400-e29b-41d4-a716-446655440001' ? 'Clyde' : 'Friend');

  return (
    <div className="fixed top-4 right-4 z-[100] w-80 bg-[#111214] rounded-lg shadow-2xl border border-white/10 p-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner animate-pulse">
          {friendName.charAt(0)}
        </div>
        <div className="text-center">
          <h3 className="text-white font-bold text-lg">{friendName}</h3>
          <p className="text-[#b5bac1] text-sm italic">Incoming {incomingCall.type} call...</p>
        </div>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={rejectIncomingCall}
            className="flex-1 bg-[#f23f43] hover:bg-[#da373c] text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={acceptIncomingCall}
            className="flex-1 bg-[#23a55a] hover:bg-[#1a7a42] text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallManager;
