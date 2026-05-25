import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { createMessage } from '../../store/slices/messageSlice';
import { startTyping } from '../../store/slices/channelSlice';
import EmojiPickerButton from './EmojiPickerButton';
import type { Message } from '../../types';

interface MessageBoxProps {
  channelId: string | null;
  channelName?: string;
  typingUsers?: string[];
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ 
  channelId, 
  channelName, 
  typingUsers = [], 
  replyingTo = null, 
  onCancelReply 
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userId } = useParams();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDM = location.pathname.startsWith('/channels/@me');
  const targetId = isDM ? userId : channelId;
  const placeholderName = isDM ? `@${channelName}` : `#${channelName || 'channel'}`;

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const api = (await import('../../services/api')).default;
        const response = await api.post('/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data && response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image file.');
      }
    }

    setAttachments((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!targetId) return;

    // Start typing indicator
    dispatch(startTyping(targetId) as any);
    
    // Allow new line with Shift+Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }

    const emptyMessage = content.replace(/\n/g, '').trim();
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (!emptyMessage && attachments.length === 0) return;
    
    // Send message
    dispatch(createMessage(targetId, { content: content.trim(), images: attachments, parentId: replyingTo?.id }, isDM) as any);
    setContent('');
    setAttachments([]);
    if (onCancelReply) onCancelReply();
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length > 3) return 'Several people are typing...';
    return `${typingUsers.join(', ')} are typing...`;
  };

  return (
    <div className="px-4 pb-6 pt-1 shrink-0">
      <div className="bg-[#383a40] rounded-lg flex flex-col focus-within:ring-1 focus-within:ring-[#5865f2] transition-shadow relative">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
        />

        {/* Khung hiển thị Đang trả lời */}
        {replyingTo && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#2b2d31] border-b border-[#3f4147]/40 rounded-t-lg text-xs text-[#b5bac1] z-10">
            <div className="flex items-center truncate">
              <span className="mr-1">Đang trả lời</span>
              <span className="font-semibold text-white mr-2">@{replyingTo.author?.username || 'User'}</span>
              <span className="truncate max-w-[500px] text-[#949ba4]">
                {replyingTo.isRecalled ? (
                  <span className="italic text-[#80848e]">Tin nhắn đã bị thu hồi</span>
                ) : (
                  replyingTo.content
                )}
              </span>
            </div>
            <button 
              type="button"
              onClick={onCancelReply}
              className="text-[#b5bac1] hover:text-white transition-colors p-1"
              title="Cancel reply"
            >
              ✕
            </button>
          </div>
        )}

        {/* Khung hiển thị ảnh preview trước khi gửi */}
        {(attachments.length > 0 || isUploading) && (
          <div className={`flex flex-wrap gap-3 px-4 pt-4 pb-2 border-b border-[#3f4147]/40 bg-[#35373c]/50 ${replyingTo ? '' : 'rounded-t-lg'}`}>
            {attachments.map((url, index) => (
              <div key={index} className="relative group w-20 h-20 rounded-md overflow-hidden bg-[#2b2d31] border border-[#232428] shadow-md">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#1e1f22]/80 hover:bg-[#1e1f22] text-white flex items-center justify-center text-[10px] transition-colors focus:outline-none"
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            ))}
            {isUploading && (
              <div className="w-20 h-20 rounded-md bg-[#2b2d31]/50 border border-dashed border-[#80848e] flex flex-col items-center justify-center text-[#dbdee1] text-[10px] space-y-1">
                <div className="w-4 h-4 border-2 border-t-transparent border-[#5865f2] rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start">
          {/* Attachment Button */}
          <div 
            onClick={handleAttachmentClick}
            className={`px-4 py-3 flex items-center justify-center cursor-pointer hover:bg-[#3f4147] transition-colors group ${
              (attachments.length > 0 || isUploading || replyingTo) ? 'rounded-bl-lg' : 'rounded-l-lg'
            }`}
            title="Upload Files"
          >
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
            placeholder={`Message ${placeholderName}`}
            className="flex-1 bg-transparent py-[11px] outline-none text-[#dbdee1] placeholder-[#80848e] resize-none"
            autoFocus 
          />
          
          {/* Right Toolbar */}
          <div className={`flex items-center space-x-1 px-2 py-2.5 ${
            (attachments.length > 0 || isUploading || replyingTo) ? 'rounded-br-lg' : 'rounded-r-lg'
          }`}>
            <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MessageBox;
