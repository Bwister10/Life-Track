import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Crown, X, Search, GripHorizontal } from 'lucide-react';

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
  isPremium?: boolean;
  darkMode?: boolean;
}

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😊', '🥰', '😎', '🤩', '🥳', '😇', '🤗', '🤔'],
  'Goals': ['🎯', '🏆', '⭐', '🌟', '💪', '🚀', '📈', '💡', '🔥', '✨', '🎉', '🏅'],
  'Health': ['🏃', '🧘', '💪', '🥗', '🍎', '💧', '😴', '🧠', '❤️', '🩺', '💊', '🏋️'],
  'Work': ['💼', '📊', '💻', '📝', '📚', '🎓', '💰', '📅', '⏰', '📧', '🗂️', '📌'],
  'Lifestyle': ['🏠', '🌱', '🎨', '🎵', '📖', '✈️', '🌍', '🎮', '📸', '🛒', '🧹', '🍳'],
  'Nature': ['🌸', '🌺', '🌻', '🌴', '🌊', '⛰️', '🌙', '☀️', '🌈', '🦋', '🐝', '🌿'],
  'Animals': ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄', '🐦'],
  'Food': ['🍕', '🍔', '🍟', '🌮', '🍣', '🍜', '🍩', '🍪', '🎂', '🍫', '☕', '🍵'],
};

const freeEmojis = ['🎯', '⭐', '💪', '📚', '🏃', '💼', '🏠', '❤️'];

export default function EmojiPicker({ selectedEmoji, onSelect, isPremium = false, darkMode = false }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Goals');
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const filteredEmojis = searchQuery
    ? Object.values(emojiCategories).flat().filter(emoji => 
        emoji.includes(searchQuery)
      )
    : emojiCategories[activeCategory as keyof typeof emojiCategories] || [];

  const handleEmojiSelect = (emoji: string) => {
    if (!isPremium && !freeEmojis.includes(emoji)) {
      return; // Don't allow selection of premium emojis
    }
    onSelect(emoji);
    setIsOpen(false);
  };

  const isEmojiLocked = (emoji: string) => !isPremium && !freeEmojis.includes(emoji);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center text-3xl
          transition-all hover:border-blue-500 hover:bg-blue-50
          ${darkMode ? 'border-gray-600 hover:bg-blue-900/20' : 'border-gray-300'}
        `}
      >
        {selectedEmoji || '➕'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              ref={constraintsRef}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Picker - Centered and Draggable */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              drag
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              className={`
                fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-80
                z-50 rounded-xl shadow-2xl border
                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}
              style={{ maxHeight: '80vh' }}
            >
              {/* Draggable Header */}
              <div 
                className={`flex items-center justify-between p-3 border-b cursor-move select-none ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-2">
                  <GripHorizontal size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Choose Icon
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                >
                  <X size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>

              {/* Search */}
              <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <input
                    type="text"
                    placeholder="Search emojis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
              </div>

              {/* Premium Banner */}
              {!isPremium && (
                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown size={16} className="text-amber-500" />
                    <span className={darkMode ? 'text-amber-400' : 'text-amber-700'}>
                      Upgrade to Pro for all emojis
                    </span>
                  </div>
                </div>
              )}

              {/* Categories */}
              {!searchQuery && (
                <div className={`flex gap-1 p-2 overflow-x-auto border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {Object.keys(emojiCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                        ${activeCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : darkMode 
                            ? 'text-gray-400 hover:bg-gray-700' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {/* Emoji Grid */}
              <div className="p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {filteredEmojis.map((emoji, index) => {
                    const locked = isEmojiLocked(emoji);
                    return (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        disabled={locked}
                        className={`
                          w-8 h-8 flex items-center justify-center text-xl rounded-lg transition-all relative
                          ${locked 
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:bg-blue-100 hover:scale-110'
                          }
                          ${selectedEmoji === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                          ${darkMode && !locked ? 'hover:bg-blue-900/30' : ''}
                        `}
                      >
                        {emoji}
                        {locked && (
                          <Crown size={10} className="absolute -top-1 -right-1 text-amber-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className={`p-3 border-t text-xs text-center ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                {isPremium ? 'All emojis unlocked' : `${freeEmojis.length} free • ${Object.values(emojiCategories).flat().length - freeEmojis.length} premium`}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
