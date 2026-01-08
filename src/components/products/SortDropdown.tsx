// src/components/products/SortDropdown.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions: SortOption[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : 'Sort By';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border-2 border-transparent hover:border-red-600 text-white ${
          isOpen ? 'rounded-t-lg' : 'rounded-lg'
        } focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 cursor-pointer font-semibold shadow-lg min-w-[200px]`}
      >
        <span>{displayLabel}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full w-full bg-zinc-800 rounded-b-lg shadow-2xl border-2 border-t-0 border-zinc-700 overflow-hidden z-50 animate-fadeIn">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left px-4 py-3 text-white font-medium transition-all duration-200 border-2 border-transparent hover:border-red-600 hover:bg-transparent rounded-lg m-1 ${
                value === option.value ? 'bg-zinc-700' : 'bg-zinc-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
