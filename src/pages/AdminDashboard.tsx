import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';

interface DashboardStats {
  users: number;
  channels: number;
  messages: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'channels'>('overview');
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  
  // States
  const [stats, setStats] = useState<DashboardStats>({ users: 0, channels: 0, messages: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  // Load stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // Load users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      // Backend returns findAndCountAll response which has { count, rows }
      const userList = res.data?.rows || res.data || [];
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
      setError('Failed to load user management data.');
    }
  };

  // Load channels
  const fetchChannels = async () => {
    try {
      const res = await api.get('/admin/channels');
      setChannels(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin channels:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchStats(), fetchUsers(), fetchChannels()]);
    } catch (err) {
      setError('An error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle User Deletion
  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      // Refresh stats
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Handle Role Change
  const handleChangeRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change role.');
    }
  };

  // Handle Channel Deletion
  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (!window.confirm(`Are you sure you want to delete channel #${channelName}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/channels/${channelId}`);
      setChannels(channels.filter(c => c.id !== channelId));
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete channel.');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'all' || 
      (roleFilter === 'admin' && user.role === 'admin') ||
      (roleFilter === 'user' && (!user.role || user.role === 'user'));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#1e1f22] flex text-[#dbdee1] font-sans antialiased relative">
      {/* Admin Sidebar */}
      <aside className={`
        w-64 bg-[#2b2d31] flex flex-col shrink-0 border-r border-[#1e1f22]
        transition-transform duration-300 ease-in-out z-40
        md:flex md:relative md:translate-x-0
        fixed top-0 left-0 h-full
        ${isAdminSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-[#1e1f22] flex items-center gap-2 font-bold text-white shadow-sm shrink-0">
          <span className="text-xl">🛡️</span>
          <span className="text-lg tracking-wider">HustCord Admin</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('overview'); setIsAdminSidebarOpen(false); }}
            className={`flex items-center px-3 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-[#404249] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            <span className="mr-3">📊</span>
            Overview
          </button>

          <button
            onClick={() => { setActiveTab('users'); setIsAdminSidebarOpen(false); }}
            className={`flex items-center px-3 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-[#404249] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            <span className="mr-3">👥</span>
            User Management
          </button>

          <button
            onClick={() => { setActiveTab('channels'); setIsAdminSidebarOpen(false); }}
            className={`flex items-center px-3 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'channels'
                ? 'bg-[#404249] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            <span className="mr-3">💬</span>
            Channels Management
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e1f22] shrink-0 bg-[#232428]">
          <button
            onClick={() => navigate('/channels/@me')}
            className="w-full py-2 px-3 bg-[#4e5058] hover:bg-[#6d6f78] text-white font-medium rounded transition-colors text-center block text-sm active:scale-95 duration-100"
          >
            Back to Chat App
          </button>
        </div>
      </aside>

      {/* Backdrop for Admin Sidebar on Mobile */}
      {isAdminSidebarOpen && (
        <div 
          onClick={() => setIsAdminSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 bg-[#313338] flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 px-4 md:px-8 border-b border-[#1e1f22] flex items-center justify-between shadow-sm shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle Admin Sidebar Button for Mobile */}
            <button 
              onClick={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)}
              className="md:hidden p-1 text-[#949ba4] hover:text-white transition-colors focus:outline-none shrink-0"
              title="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base md:text-xl font-bold text-white uppercase tracking-wide truncate">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'users' && 'Manage Registered Users'}
              {activeTab === 'channels' && 'Manage Server Channels'}
            </h1>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-[#3f4147] rounded-full transition-colors text-[#949ba4] hover:text-white shrink-0"
            title="Refresh Data"
          >
            🔄
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-[#949ba4]">
              <div className="animate-spin text-3xl">⏳</div>
              <p>Fetching database statistics...</p>
            </div>
          ) : (
            <>
              {/* Tab: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Grid Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-[#2b2d31] rounded-xl border border-[#1e1f22] flex items-center justify-between hover:scale-[1.02] transition-transform duration-200 shadow-md">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#949ba4]">Registered Users</p>
                        <h2 className="text-3xl font-extrabold text-white mt-2">{stats.users}</h2>
                      </div>
                      <span className="text-4xl bg-[#3f4147] p-3 rounded-full">👥</span>
                    </div>

                    <div className="p-6 bg-[#2b2d31] rounded-xl border border-[#1e1f22] flex items-center justify-between hover:scale-[1.02] transition-transform duration-200 shadow-md">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#949ba4]">Total Channels</p>
                        <h2 className="text-3xl font-extrabold text-white mt-2">{stats.channels}</h2>
                      </div>
                      <span className="text-4xl bg-[#3f4147] p-3 rounded-full">💬</span>
                    </div>

                    <div className="p-6 bg-[#2b2d31] rounded-xl border border-[#1e1f22] flex items-center justify-between hover:scale-[1.02] transition-transform duration-200 shadow-md">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#949ba4]">Messages Exchanged</p>
                        <h2 className="text-3xl font-extrabold text-white mt-2">{stats.messages}</h2>
                      </div>
                      <span className="text-4xl bg-[#3f4147] p-3 rounded-full">✉️</span>
                    </div>
                  </div>

                  {/* Dashboard Widgets */}
                  <div className="p-6 bg-[#2b2d31] rounded-xl border border-[#1e1f22] space-y-4 shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
                      <button 
                        onClick={() => setActiveTab('users')} 
                        className="text-sm text-[#5865f2] hover:underline font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-[#1e1f22] text-sm">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={u.avatar || 'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png'}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover bg-gray-600 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">{u.username}</p>
                              <p className="text-xs text-[#949ba4] truncate">{u.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            u.role === 'admin' 
                              ? 'bg-[#23a55a]/10 text-[#23a55a]' 
                              : 'bg-[#949ba4]/10 text-[#949ba4]'
                          }`}>
                            {u.role === 'admin' ? 'ADMIN' : 'USER'}
                          </span>
                        </div>
                      ))}
                      {users.length === 0 && (
                        <p className="py-4 text-[#949ba4] italic text-center">No recent registrations.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: USERS */}
              {activeTab === 'users' && (
                <div className="bg-[#2b2d31] rounded-xl border border-[#1e1f22] overflow-hidden shadow-md">
                  {/* Controls / Filter bar */}
                  <div className="p-5 border-b border-[#1e1f22] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#2b2d31]/80">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-80 px-4 py-2 bg-[#1e1f22] border border-[#3f4147] rounded-md text-white focus:outline-none focus:border-[#5865f2] text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase text-[#949ba4]">Filter Role:</label>
                      <select
                        value={roleFilter}
                        onChange={(e: any) => setRoleFilter(e.target.value)}
                        className="px-3 py-1.5 bg-[#1e1f22] border border-[#3f4147] rounded-md text-white focus:outline-none focus:border-[#5865f2] text-sm"
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#232428] text-xs font-bold uppercase tracking-wider text-[#949ba4] border-b border-[#1e1f22]">
                          <th className="py-4 px-6">Avatar</th>
                          <th className="py-4 px-6">Username</th>
                          <th className="py-4 px-6">Email</th>
                          <th className="py-4 px-6">Role</th>
                          <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1f22] text-sm">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-[#35373c] transition-colors">
                              <td className="py-4 px-6">
                                <img
                                  src={user.avatar || 'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png'}
                                  alt="avatar"
                                  className="w-9 h-9 rounded-full object-cover bg-gray-600"
                                />
                              </td>
                              <td className="py-4 px-6 font-bold text-white">{user.username}</td>
                              <td className="py-4 px-6 text-[#949ba4]">{user.email}</td>
                              <td className="py-4 px-6">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  user.role === 'admin' 
                                    ? 'bg-[#23a55a]/10 text-[#23a55a]' 
                                    : 'bg-[#949ba4]/10 text-[#949ba4]'
                                }`}>
                                  {user.role === 'admin' ? 'ADMIN' : 'USER'}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => handleChangeRole(user.id, user.role || 'user')}
                                    className="px-3 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white font-medium text-xs rounded transition-colors"
                                  >
                                    Toggle Role
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                    className="px-3 py-1.5 bg-[#f23f43] hover:bg-[#da373c] text-white font-medium text-xs rounded transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-[#949ba4] italic">
                              No users match search queries.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: CHANNELS */}
              {activeTab === 'channels' && (
                <div className="bg-[#2b2d31] rounded-xl border border-[#1e1f22] overflow-hidden shadow-md">
                  <div className="p-5 border-b border-[#1e1f22] bg-[#2b2d31]/80">
                    <p className="text-sm text-[#949ba4]">Overview of all text/voice channels across servers.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#232428] text-xs font-bold uppercase tracking-wider text-[#949ba4] border-b border-[#1e1f22]">
                          <th className="py-4 px-6">Channel Name</th>
                          <th className="py-4 px-6">Type</th>
                          <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1f22] text-sm">
                        {channels.length > 0 ? (
                          channels.map((chan) => (
                            <tr key={chan.id} className="hover:bg-[#35373c] transition-colors">
                              <td className="py-4 px-6 font-bold text-white"># {chan.name}</td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  chan.type === 'VOICE' ? 'bg-[#5865f2]/20 text-[#5865f2]' : 'bg-[#747f8d]/20 text-[#dbdee1]'
                                }`}>
                                  {chan.type || 'TEXT'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  onClick={() => handleDeleteChannel(chan.id, chan.name)}
                                  className="px-3 py-1.5 bg-[#f23f43] hover:bg-[#da373c] text-white font-medium text-xs rounded transition-colors"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-12 text-center text-[#949ba4] italic">
                              No channels found in database.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
