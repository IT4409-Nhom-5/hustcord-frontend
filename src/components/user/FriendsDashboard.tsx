import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { setFriends } from '../../store/slices/authSlice';
import api from '../../services/api';
import UserAvatar from './UserAvatar';
import { 
  Search, 
  MessageSquare, 
  UserCheck, 
  UserX as DeclineIcon, 
  UserPlus, 
  Check, 
  X, 
  Clock, 
  Ban, 
  User, 
  Sparkles,
  Inbox,
  Loader2,
  Trash2
} from 'lucide-react';

interface FriendsDashboardProps {
  activeTab: 'all' | 'pending' | 'blocked' | 'add_friend';
  setActiveTab: (tab: 'all' | 'pending' | 'blocked' | 'add_friend') => void;
}

const FriendsDashboard: React.FC<FriendsDashboardProps> = ({ activeTab, setActiveTab: _ }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const friends = useAppSelector((state) => state.auth.friends) || [];

  // Local state
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingList, setLoadingList] = useState(false);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Helper to extract avatar image (unused - UserAvatar handles it)
  // const getAvatar = (user: any) => {
  //   return user?.avatarURL || user?.avatar || user?.image || '';
  // };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Friends list
  const fetchFriends = async () => {
    if (!currentUser) return;
    try {
      const response = await api.get(`/users/${currentUser.id}/friends`);
      if (response.data.statusCode === '200') {
        dispatch(setFriends(response.data.friends));
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  // Fetch Pending requests
  const fetchRequests = async () => {
    if (!currentUser) return;
    setLoadingList(true);
    try {
      const response = await api.get(`/users/${currentUser.id}/requests`);
      if (response.data.statusCode === '200') {
        setPendingRequests(response.data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch Blocked users
  const fetchBlocked = async () => {
    if (!currentUser) return;
    setLoadingList(true);
    try {
      const response = await api.get(`/users/${currentUser.id}/blocked`);
      if (response.data.statusCode === '200') {
        setBlockedUsers(response.data.blocked || []);
      }
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch lists depending on active tab
  useEffect(() => {
    if (activeTab === 'pending') {
      fetchRequests();
    } else if (activeTab === 'blocked') {
      fetchBlocked();
    } else {
      fetchFriends();
    }
    setFeedback(null);
  }, [activeTab, currentUser]);

  // Handle live user search suggestions (Add Friend tab)
  useEffect(() => {
    if (!addFriendInput.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/users/search/${addFriendInput.trim()}`);
        // Filter out current user from suggestions
        const filtered = (res.data || []).filter((u: any) => u.id !== currentUser?.id);
        setSuggestions(filtered);
      } catch (err) {
        console.error("Search query failed:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms Debounce

    return () => clearTimeout(delayDebounceFn);
  }, [addFriendInput, currentUser]);

  // Action: Add Friend (Sends Request)
  const handleSendRequest = async (targetUser: any) => {
    if (!currentUser) return;
    try {
      const res = await api.post('/users/request', {
        id: currentUser.id,
        otherId: targetUser.id,
        status: true
      });

      if (res.data.statusCode === '200' || res.status === 201 || res.status === 200) {
        setFeedback({ type: 'success', message: `Friend request sent to ${targetUser.username}!` });
        // Clear input and suggestions
        setAddFriendInput('');
        setSuggestions([]);
      } else {
        setFeedback({ type: 'error', message: res.data.message || 'Failed to send request.' });
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to send friend request.';
      setFeedback({ type: 'error', message: errMsg });
    }
  };

  // Action: Accept Request
  const handleAcceptRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    try {
      await api.post('/users/friend', {
        id: currentUser.id,
        otherId: targetUserId,
        status: true
      });
      setFeedback({ type: 'success', message: 'Friend request accepted!' });
      fetchRequests();
      fetchFriends();
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to accept friend request.' });
    }
  };

  // Action: Decline Request
  const handleDeclineRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    try {
      await api.post('/users/request', {
        id: targetUserId,
        otherId: currentUser.id,
        status: false
      });
      setFeedback({ type: 'success', message: 'Friend request declined.' });
      fetchRequests();
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to decline friend request.' });
    }
  };

  // Action: Unfriend / Remove Friend
  const handleRemoveFriend = async (friendId: string, name: string) => {
    if (!currentUser) return;
    if (!window.confirm(`Are you sure you want to remove ${name} from your friends?`)) return;
    try {
      await api.post('/users/friend', {
        id: currentUser.id,
        otherId: friendId,
        status: false
      });
      setFeedback({ type: 'success', message: `Removed ${name} from friends list.` });
      fetchFriends();
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to remove friend.' });
    }
  };

  // Action: Block User
  const handleBlockUser = async (targetUserId: string, name: string) => {
    if (!currentUser) return;
    if (!window.confirm(`Are you sure you want to block ${name}?`)) return;
    try {
      await api.post('/users/blocked', {
        id: currentUser.id,
        otherId: targetUserId,
        status: true
      });
      setFeedback({ type: 'success', message: `Blocked ${name}.` });
      fetchFriends();
      fetchRequests();
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to block user.' });
    }
  };

  // Action: Unblock User
  const handleUnblockUser = async (targetUserId: string, name: string) => {
    if (!currentUser) return;
    try {
      await api.post('/users/blocked', {
        id: currentUser.id,
        otherId: targetUserId,
        status: false
      });
      setFeedback({ type: 'success', message: `Unblocked ${name}.` });
      fetchBlocked();
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to unblock user.' });
    }
  };

  // Route to DM chat
  const handleStartDM = (friendId: string) => {
    navigate(`/channels/@me/${friendId}`);
  };

  // Helper to render status indicator
  const renderStatusDot = (status?: string) => {
    const s = status?.toUpperCase() || 'ONLINE';
    switch (s) {
      case 'ONLINE':
        return <div className="w-3.5 h-3.5 bg-[#23a55a] rounded-full border-2 border-[#313338]" title="Online" />;
      case 'IDLE':
        return <div className="w-3.5 h-3.5 bg-[#f0b232] rounded-full border-2 border-[#313338]" title="Idle" />;
      case 'DND':
        return <div className="w-3.5 h-3.5 bg-[#f23f43] rounded-full border-2 border-[#313338]" title="Do Not Disturb" />;
      default:
        return <div className="w-3.5 h-3.5 bg-[#80848e] rounded-full border-2 border-[#313338]" title="Online" />;
    }
  };

  // Filter friends list locally
  const filteredFriends = friends.filter((friend) => {
    return friend?.username?.toLowerCase().includes(localSearchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 flex bg-[#313338] text-[#dbdee1] flex-col min-w-0 min-h-0 relative select-none">
      {/* Toast feedback alerts */}
      {feedback && (
        <div className={`mx-6 mt-4 p-3 rounded-md flex items-center justify-between transition-all duration-300 border ${
          feedback.type === 'success' 
            ? 'bg-[#23a55a]/10 border-[#23a55a] text-[#23a55a]' 
            : 'bg-[#f23f43]/10 border-[#f23f43] text-[#f23f43]'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side: Friends/Suggestions List Panel */}
        <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto custom-scrollbar">
          
          {/* TAB: All */}
          {activeTab === 'all' && (
            <div className="flex flex-col h-full">
              {/* Search Friends bar */}
              <div className="relative mb-5 shrink-0">
                <input 
                  type="text" 
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search friends..." 
                  className="w-full h-9 bg-[#1e1f22] text-[#dbdee1] placeholder-[#949ba4] text-sm px-3 pl-10 rounded-md outline-none border border-transparent focus:border-[#5865f2] transition-colors"
                />
                <Search className="w-4 h-4 text-[#949ba4] absolute left-3.5 top-2.5" />
                {localSearchQuery && (
                  <button 
                    onClick={() => setLocalSearchQuery('')}
                    className="absolute right-3 top-2 text-[#949ba4] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Title list header */}
              <div className="text-xs font-bold text-[#949ba4] uppercase tracking-wider mb-2 shrink-0">
                {`All Friends — ${filteredFriends.length}`}
              </div>

              {/* Friends table list */}
              {filteredFriends.length > 0 ? (
                <div className="divide-y divide-[#35373c]">
                  {filteredFriends.map((friend) => (
                    <div 
                      key={friend.id}
                      className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#3f4147]/40 cursor-pointer transition-all duration-150 mb-1"
                      onClick={() => handleStartDM(friend.id)}
                    >
                      <div className="flex items-center min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0 mr-3">
                          <UserAvatar user={friend} size="lg" />
                          <div className="absolute bottom-0 right-0">
                            {renderStatusDot(friend.status)}
                          </div>
                        </div>

                        {/* Name and Status Message */}
                        <div className="min-w-0">
                          <span className="font-semibold text-[#f2f3f5] truncate block group-hover:text-white">
                            {friend.username}
                          </span>
                          <span className="text-xs text-[#949ba4] block truncate">
                            {friend.status?.toUpperCase() !== 'OFFLINE' ? (friend.status?.toLowerCase() || 'Online') : 'Offline'}
                          </span>
                        </div>
                      </div>

                      {/* Hover action icons */}
                      <div className="flex items-center gap-2.5 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleStartDM(friend.id)}
                          className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#1e1f22] flex items-center justify-center text-[#b5bac1] hover:text-[#f2f3f5] transition-colors"
                          title="Start DM Chat"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleBlockUser(friend.id, friend.username)}
                          className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#f23f43]/20 flex items-center justify-center text-[#b5bac1] hover:text-[#f23f43] transition-colors"
                          title="Block User"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleRemoveFriend(friend.id, friend.username)}
                          className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#f23f43]/20 flex items-center justify-center text-[#b5bac1] hover:text-[#f23f43] transition-colors"
                          title="Remove Friend"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-32 h-32 bg-[#2b2d31]/50 rounded-full flex items-center justify-center mb-4">
                    <User className="w-16 h-16 text-[#80848e]" />
                  </div>
                  <h3 className="text-[#f2f3f5] font-semibold text-lg">No one's around to play with</h3>
                  <p className="text-[#949ba4] text-sm mt-1 max-w-xs">
                    {localSearchQuery ? 'No friends match your search.' : 'You can find other users and add them as friends in the Add Friend tab.'}
                  </p>
                  {localSearchQuery && (
                    <button 
                      onClick={() => setLocalSearchQuery('')}
                      className="mt-4 text-[#5865f2] hover:underline text-sm font-medium"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: Pending Requests */}
          {activeTab === 'pending' && (
            <div className="flex flex-col h-full">
              <div className="text-xs font-bold text-[#949ba4] uppercase tracking-wider mb-4 shrink-0">
                Pending Friend Requests — {pendingRequests.length}
              </div>

              {loadingList ? (
                <div className="flex-1 flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#5865f2]" />
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="divide-y divide-[#35373c]">
                  {pendingRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#3f4147]/40 cursor-default transition-all duration-150 mb-1"
                    >
                      <div className="flex items-center min-w-0">
                        {/* Avatar */}
                        <UserAvatar user={request} size="lg" className="mr-3" />

                        {/* Name / Info */}
                        <div className="min-w-0">
                          <span className="font-semibold text-[#f2f3f5] truncate block group-hover:text-white">
                            {request.username}
                          </span>
                          <span className="text-xs text-[#23a55a] block truncate flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Incoming friend request
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 ml-4 shrink-0">
                        <button 
                          onClick={() => handleAcceptRequest(request.id)}
                          className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#23a55a]/20 flex items-center justify-center text-[#23a55a] transition-colors"
                          title="Accept Request"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeclineRequest(request.id)}
                          className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#f23f43]/20 flex items-center justify-center text-[#f23f43] transition-colors"
                          title="Ignore Request"
                        >
                          <DeclineIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-32 h-32 bg-[#2b2d31]/50 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="w-16 h-16 text-[#80848e]" />
                  </div>
                  <h3 className="text-[#f2f3f5] font-semibold text-lg">No pending requests</h3>
                  <p className="text-[#949ba4] text-sm mt-1 max-w-xs">
                    You have no incoming friend requests. When someone adds you, it will show up here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Blocked Users */}
          {activeTab === 'blocked' && (
            <div className="flex flex-col h-full">
              <div className="text-xs font-bold text-[#949ba4] uppercase tracking-wider mb-4 shrink-0">
                Blocked Users — {blockedUsers.length}
              </div>

              {loadingList ? (
                <div className="flex-1 flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#5865f2]" />
                </div>
              ) : blockedUsers.length > 0 ? (
                <div className="divide-y divide-[#35373c]">
                  {blockedUsers.map((blocked) => (
                    <div 
                      key={blocked.id}
                      className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#3f4147]/40 cursor-default transition-all duration-150 mb-1"
                    >
                      <div className="flex items-center min-w-0">
                        {/* Avatar */}
                        <UserAvatar user={blocked} size="lg" className="mr-3" />

                        {/* Name / Status */}
                        <div className="min-w-0">
                          <span className="font-semibold text-[#f2f3f5] truncate block group-hover:text-white">
                            {blocked.username}
                          </span>
                          <span className="text-xs text-[#f23f43] block truncate">
                            Blocked
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 ml-4 shrink-0">
                        <button 
                          onClick={() => handleUnblockUser(blocked.id, blocked.username)}
                          className="px-3 h-9 rounded-full bg-[#2b2d31] hover:bg-[#3f4147] flex items-center gap-1.5 text-sm font-medium text-[#f2f3f5] transition-colors"
                          title="Unblock User"
                        >
                          <Check className="w-4 h-4" /> Unblock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-32 h-32 bg-[#2b2d31]/50 rounded-full flex items-center justify-center mb-4">
                    <Ban className="w-16 h-16 text-[#80848e]" />
                  </div>
                  <h3 className="text-[#f2f3f5] font-semibold text-lg">No blocked users</h3>
                  <p className="text-[#949ba4] text-sm mt-1 max-w-xs">
                    You haven't blocked anyone.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Add Friend (Friend Search with suggestions) */}
          {activeTab === 'add_friend' && (
            <div className="flex flex-col h-full w-full">
              <h2 className="text-[#f2f3f5] font-bold text-base uppercase shrink-0">Add Friend</h2>
              <p className="text-xs text-[#949ba4] mt-1 mb-4 shrink-0">
                You can add friends with their HustCord username.
              </p>

              {/* Search / Add input container */}
              <div ref={autocompleteRef} className="relative shrink-0 mb-8">
                <div className={`flex items-center bg-[#1e1f22] rounded-lg px-4 py-2 border transition-colors ${
                  searchFocused ? 'border-[#5865f2]' : 'border-transparent'
                }`}>
                  <input 
                    type="text" 
                    value={addFriendInput}
                    onChange={(e) => setAddFriendInput(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Enter a Username..." 
                    className="flex-1 bg-transparent text-[#dbdee1] placeholder-[#949ba4] text-sm outline-none border-none py-1"
                  />
                  {addFriendInput && (
                    <button 
                      onClick={() => setAddFriendInput('')}
                      className="text-[#949ba4] hover:text-white mr-3"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-[#5865f2] animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-[#949ba4]" />
                  )}
                </div>

                {/* Real-time Autocomplete Suggestions Dropdown */}
                {addFriendInput.trim() && (suggestions.length > 0 || !isSearching) && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#1e1f22]/95 backdrop-blur-md border border-[#3f4147] rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-200">
                    <div className="px-3.5 py-2 border-b border-[#35373c] text-xs font-bold text-[#949ba4] uppercase tracking-wider bg-[#1e1f22]/50 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#5865f2]" /> suggested users ({suggestions.length})
                    </div>
                    {suggestions.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {suggestions.map((user) => {
                          const isAlreadyFriend = friends.some((f) => f.id === user.id);
                          return (
                            <div 
                              key={user.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-[#35373c] transition-colors"
                            >
                              <div className="flex items-center min-w-0 mr-3">
                                {/* Avatar */}
                                <UserAvatar user={user} size="md" className="mr-3" />
                                <div className="min-w-0">
                                  <span className="font-semibold text-sm text-[#f2f3f5] truncate block">
                                    {user.username}
                                  </span>
                                  <span className="text-xs text-[#949ba4] block truncate">
                                    {user.email}
                                  </span>
                                </div>
                              </div>

                              {/* Action buttons inside suggestion row */}
                              <div className="shrink-0 flex items-center gap-1.5">
                                {isAlreadyFriend ? (
                                  <>
                                    <span className="text-xs text-[#23a55a] font-medium bg-[#23a55a]/10 px-2.5 py-1 rounded flex items-center gap-1.5">
                                      <Check className="w-3.5 h-3.5" /> Friends
                                    </span>
                                    <button 
                                      onClick={() => handleStartDM(user.id)}
                                      className="p-1.5 rounded-full hover:bg-gray-700 text-[#b5bac1] hover:text-[#f2f3f5] transition-colors"
                                      title="Message Friend"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleSendRequest(user)}
                                    className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                                  >
                                    <UserPlus className="w-3.5 h-3.5" /> Add Friend
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 px-4 text-center text-sm text-[#949ba4]">
                        No users found matching "{addFriendInput}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Graphic/Visual placeholder */}
              <div className="flex-1 flex flex-col items-center justify-center text-center mt-6">
                <div className="w-44 h-44 bg-[#2b2d31]/30 rounded-full flex items-center justify-center mb-6">
                  <UserPlus className="w-20 h-20 text-[#80848e]/50" />
                </div>
                <h3 className="text-[#f2f3f5] font-semibold text-lg">Looking for new friends?</h3>
                <p className="text-[#949ba4] text-sm mt-1 max-w-sm">
                  Start typing a username in the search bar above. Matching users will automatically appear as you type. Click add friend to send them a request!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Active Now Panel (Discord style sidebar panel) */}
        <div className="hidden lg:flex w-80 border-l border-[#35373c] flex-col p-6 overflow-y-auto custom-scrollbar shrink-0 bg-[#313338]">
          <h2 className="text-[#f2f3f5] font-extrabold text-xl mb-4">Active Now</h2>
          
          <div className="bg-[#2b2d31] rounded-xl p-4 flex flex-col items-center text-center border border-[#3f4147]/30 select-none">
            <h3 className="text-[#f2f3f5] font-bold text-sm">It's quiet for now...</h3>
            <p className="text-xs text-[#949ba4] mt-1.5 leading-relaxed">
              When a friend starts an activity it will show here!
            </p>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xs font-bold text-[#949ba4] uppercase tracking-wider mb-3">Recent Activity</h4>
            <div className="flex flex-col gap-3">
              {friends.filter(f => f.status && f.status.toUpperCase() !== 'OFFLINE').slice(0, 3).map((friend) => (
                <div 
                  key={friend.id}
                  onClick={() => handleStartDM(friend.id)}
                  className="flex items-center p-2 hover:bg-[#35373c] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="relative mr-3">
                    <UserAvatar user={friend} size="md" />
                    <div className="absolute bottom-0 right-0">
                      {renderStatusDot(friend.status)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[#f2f3f5] block truncate">{friend.username}</span>
                    <span className="text-xs text-[#949ba4] block truncate">Online now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FriendsDashboard;
