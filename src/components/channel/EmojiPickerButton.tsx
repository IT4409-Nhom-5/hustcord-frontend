import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, {type EmojiClickData, Theme } from 'emoji-picker-react';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-[#b5bac1] hover:text-[#dbdee1] transition-colors focus:outline-none"
        title="Select Emoji"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} lazyLoadEmojis={true} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;