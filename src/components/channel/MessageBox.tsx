import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage } from '../../store/slices/messageSlice';
import { startTyping } from '../../store/slices/channelSlice';

interface MessageBoxProps {
  channelId: string;
  channelName?: string;
  typingUsers?: string[];
}

const MessageBox: React.FC<MessageBoxProps> = ({ channelId, channelName, typingUsers = [] }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Start typing indicator
    dispatch(startTyping(channelId) as any);
    
    // Allow new line with Shift+Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }

    const emptyMessage = content.replace(/\n/g, '').trim();
    if (event.key !== 'Enter' || event.shiftKey || !emptyMessage) return;
    
    // Send message
    dispatch(createMessage(channelId, { content: content.trim() }) as any);
    setContent('');
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length > 3) return 'Several people are typing...';
    return `${typingUsers.join(', ')} are typing...`;
  };

  return (
    <div className="px-4 pb-6 pt-1 shrink-0">
      <div className="bg-[#383a40] rounded-lg flex items-start overflow-hidden focus-within:ring-1 focus-within:ring-[#5865f2] transition-shadow">
        {/* Attachment Button */}
        <div className="px-4 py-2.5 h-full flex items-center justify-center cursor-pointer hover:bg-[#3f4147] transition-colors group">
          <div className="w-6 h-6 bg-[#b5bac1] rounded-full flex items-center justify-center group-hover:bg-white text-[#383a40]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z"/></svg>
          </div>
        </div>
        
        {/* Input Area */}
        <TextareaAutosize
          onChange={e => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          value={content}
          minRows={1}
          maxRows={10}
          placeholder={`Message #${channelName || 'channel'}`}
          className="flex-1 bg-transparent py-[11px] outline-none text-[#dbdee1] placeholder-[#80848e] resize-none"
          autoFocus 
        />
        
        {/* Right Toolbar */}
        <div className="flex items-center space-x-1 px-2 py-2.5">
          <button className="p-1 text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer" title="Send a gift">🎁</button>
          <button className="p-1 text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer" title="Select emoji">😀</button>
        </div>
      </div>
      
      {/* Typing Indicator Area */}
      <div className="h-4 mt-1 px-1 text-xs font-semibold text-[#dbdee1]">
        {getTypingText()}
      </div>
    </div>
  );
};

export default MessageBox;
