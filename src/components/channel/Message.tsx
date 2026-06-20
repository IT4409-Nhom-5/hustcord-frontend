import React, { useState, useRef, useEffect } from 'react';
import type { Message as MessageType } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { deleteMessage, toggleReaction } from '../../store/slices/messageSlice';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import UserAvatar from '../user/UserAvatar';

interface MessageProps {
  message: MessageType;
  onReply?: (message: MessageType) => void;
}

const Message: React.FC<MessageProps> = ({ message, onReply }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const reactionPickerRef = useRef<HTMLDivElement>(null);

  // Close reaction picker on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwnMessage = message.authorId === currentUser?.id || message.userId === currentUser?.id;

  const handleReact = (emoji: string) => {
    dispatch(toggleReaction(message.id, emoji) as any);
    setShowReactionPicker(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleReact(emojiData.emoji);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn thu hồi tin nhắn này không?')) {
      dispatch(deleteMessage(message.id) as any);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  // 1. Render tin nhắn đã thu hồi
  if (message.isRecalled) {
    return (
      <div className="flex mt-[17px] hover:bg-[#2e3035]/30 p-1 -mx-4 px-4 transition-colors group relative items-center">
        {/* Avatar system placeholder */}
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[#2b2d31] flex items-center justify-center text-[#80848e] shadow-inner border border-[#232428]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className="ml-4 flex-1 flex items-baseline">
          <span className="text-xs italic text-[#80848e] font-medium">
            {message.author?.username || 'Unknown User'} đã thu hồi một tin nhắn.
          </span>
          <span className="text-[10px] text-[#80848e] ml-2 font-medium">
            {time}
          </span>
        </div>
      </div>
    );
  }

  // 2. Render tin nhắn bình thường
  return (
    <div className="flex flex-col mt-[17px] hover:bg-[#2e3035] p-1 -mx-4 px-4 transition-colors group relative rounded-md">
      {/* Curved reply indicator if this is a reply */}
      {message.parent && (
        <div className="flex items-center text-xs text-[#b5bac1] mb-1.5 ml-[18px] select-none opacity-85 hover:opacity-100 transition-opacity">
          <svg className="w-9 h-4 text-[#4e5058] mr-1 -mt-1 shrink-0" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15V8a4 4 0 0 1 4-4h20" strokeLinecap="round" />
          </svg>
          <span className="font-semibold text-[#dbdee1] hover:underline cursor-pointer mr-2 shrink-0">
            @{message.parent.author?.username || 'Unknown'}
          </span>
          <span className="truncate max-w-[400px] text-[#949ba4] text-[11px]">
            {message.parent.isRecalled ? (
              <span className="italic text-[#80848e]">Tin nhắn đã bị thu hồi</span>
            ) : (
              message.parent.content || (message.parent.images && message.parent.images.length > 0 ? '📷 [Ảnh]' : '')
            )}
          </span>
        </div>
      )}

      <div className="flex items-start">
        {/* Avatar */}
        <UserAvatar user={message.author} size="xlg" className="mt-0.5 cursor-pointer hover:shadow-lg transition-all" />
        
        {/* Nội dung tin nhắn */}
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-baseline">
            <span className="font-medium text-white mr-2 hover:underline cursor-pointer">
              {message.author?.username || 'Unknown User'}
            </span>
            <span className="text-[11px] font-medium text-[#80848e]">
              {time}
            </span>
          </div>
          {message.content && (
            <div className="text-[#dbdee1] mt-0.5 leading-normal whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
          {message.images && message.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.images.map((url, idx) => (
                <div key={idx} className="max-w-sm rounded-lg overflow-hidden border border-[#232428] bg-[#2b2d31] hover:brightness-95 transition-all shadow-md">
                  <img
                    src={url}
                    alt="Attachment"
                    className="max-h-[300px] max-w-full object-contain cursor-pointer"
                    onClick={() => window.open(url, '_blank')}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Hộp chứa emoji reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 select-none">
              {message.reactions.map((reaction, idx) => {
                const hasReacted = reaction.users?.some((u) => u.id === currentUser?.id);
                const tooltipText = reaction.users?.map((u) => u.username).join(', ') || '';
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleReact(reaction.emoji)}
                    className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md border text-xs transition-colors focus:outline-none ${
                      hasReacted
                        ? 'border-[#5865f2] bg-[#5865f2]/10 text-white hover:bg-[#5865f2]/20'
                        : 'border-[#3f4147] bg-[#2b2d31] text-[#b5bac1] hover:bg-[#35373c] hover:text-white'
                    }`}
                    title={`${tooltipText} đã thả cảm xúc ${reaction.emoji}`}
                  >
                    <span className="text-sm">{reaction.emoji}</span>
                    <span className="font-semibold">{reaction.users?.length || 0}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar xuất hiện khi hover hoặc khi đang mở bảng chọn cảm xúc */}
      <div className={`absolute -top-4 right-4 bg-[#313338] border border-[#232428] rounded-md shadow-lg h-8 items-center px-1 space-x-1 z-10 ${
        showReactionPicker ? 'flex' : 'hidden group-hover:flex'
      }`}>
        {/* Reaction picker trigger */}
        <div className="relative" ref={reactionPickerRef}>
          <button 
            type="button"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`p-1.5 hover:bg-[#3f4147] rounded transition-colors focus:outline-none ${showReactionPicker ? 'text-[#dbdee1] bg-[#3f4147]' : 'text-[#b5bac1] hover:text-[#dbdee1]'}`}
            title="Thêm cảm xúc"
          >
            😀
          </button>
          {showReactionPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <EmojiPicker 
                onEmojiClick={handleEmojiClick} 
                theme={Theme.DARK} 
                lazyLoadEmojis={true} 
              />
            </div>
          )}
        </div>

        {/* Reply button */}
        <button 
          type="button"
          onClick={handleReply}
          className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-[#dbdee1] rounded transition-colors focus:outline-none" 
          title="Trả lời"
        >
          💬
        </button>

        {/* Only allow recall/delete of own messages */}
        {isOwnMessage && (
          <button 
            type="button"
            onClick={handleDelete}
            className="p-1.5 hover:bg-[#3f4147] text-red-400 hover:bg-red-500/10 rounded transition-colors focus:outline-none" 
            title="Thu hồi tin nhắn"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
