import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Badge } from './Badge';

interface TagInputProps {
  label: string;
  tags: string[];
  suggestions?: string[];
  placeholder?: string;
  onChange: (tags: string[]) => void;
  onSearch?: (value: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  label, 
  tags, 
  suggestions = [], 
  placeholder, 
  onChange,
  onSearch 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onSearch) onSearch(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/^#/, '');
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addTag(suggestions[selectedIndex]);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(s => !tags.includes(s));

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-[14px] font-black text-stone-600 uppercase tracking-wider">{label}</label>
      
      <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-50 border-2 border-stone-100 rounded-2xl focus-within:border-[#FF6B00]/30 focus-within:bg-white transition-all min-h-[56px]">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            className="flex items-center gap-1.5 pl-3 pr-2 py-2 !bg-[#FF6B00] !text-white !border-none shadow-md shadow-[#FF6B00]/20 animate-in zoom-in-95 duration-200"
          >
            <span className="text-white/70 font-black text-[12px]">#</span>
            <span className="font-bold">{tag}</span>
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-bold text-stone-700 placeholder:text-stone-300 min-w-[120px]"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-stone-100 rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden animate-in fade-in slide-in-from-top-1">
          <ul className="py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <li 
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className={`px-4 py-2.5 text-[14px] font-bold cursor-pointer flex items-center justify-between transition-colors ${
                  index === selectedIndex ? 'bg-orange-50 text-[#FF6B00]' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-stone-300">#</span>
                  {suggestion}
                </div>
                {index === selectedIndex && (
                  <span className="text-[11px] font-black uppercase tracking-tighter bg-orange-100 px-1.5 py-0.5 rounded">Enter</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[12px] text-stone-400 font-bold ml-1 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        엔터 또는 쉼표를 입력하여 태그를 생성하세요.
      </p>
    </div>
  );
};
