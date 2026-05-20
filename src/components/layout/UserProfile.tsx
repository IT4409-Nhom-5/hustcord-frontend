import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '~/stores/auth.store';
import { useUIStore } from '~/stores/ui.store';
import type { User } from '~/types';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const setUserProfileModalOpen = useUIStore((state) => state.setUserProfileModalOpen);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <button
        onClick={() => setUserProfileModalOpen(true)}
        className="flex-1 flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition"
      >
        {user.image && (
          <img
            src={user.image}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        {!user.image && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.username}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </button>
      <button
        onClick={handleLogout}
        className="p-2 hover:bg-red-500/20 rounded-lg transition text-gray-400 hover:text-red-400"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
