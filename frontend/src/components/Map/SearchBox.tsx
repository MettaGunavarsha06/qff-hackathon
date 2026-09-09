import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, Landmark, Building2, Utensils, Plane, Cross } from 'lucide-react';
import { searchPlaces } from '../../services/geocoding';
import type { GeocodingResult } from '../../services/geocoding';

interface SearchBoxProps {
  onSelectPlace: (place: GeocodingResult) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSelectPlace,
  placeholder = 'Search places, cities, attractions worldwide...',
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchPlaces(query, 6);
        setResults(data);
        setIsOpen(data.length > 0);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (place: GeocodingResult) => {
    setQuery(place.name);
    setIsOpen(false);
    onSelectPlace(place);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string, type: string) => {
    if (category === 'tourism' || type === 'attraction' || type === 'monument') {
      return <Landmark className="w-3.5 h-3.5 text-[#FF5B37]" />;
    }
    if (category === 'amenity' && (type === 'restaurant' || type === 'cafe')) {
      return <Utensils className="w-3.5 h-3.5 text-[#F59E0B]" />;
    }
    if (type === 'aeroway' || type === 'airport') {
      return <Plane className="w-3.5 h-3.5 text-[#3B82F6]" />;
    }
    if (type === 'hospital' || type === 'clinic') {
      return <Cross className="w-3.5 h-3.5 text-[#EF4444]" />;
    }
    if (category === 'building' || category === 'office') {
      return <Building2 className="w-3.5 h-3.5 text-[#6B6D76]" />;
    }
    return <MapPin className="w-3.5 h-3.5 text-[#10B981]" />;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-soft-sm px-3 py-1.5 transition-all focus-within:border-[#1F2024] focus-within:shadow-md">
        <Search className="w-3.5 h-3.5 text-[#8E909A] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full px-2.5 text-xs text-[#1F2024] placeholder:text-[#8E909A] bg-transparent focus:outline-none font-sans"
        />
        {isSearching && (
          <Loader2 className="w-3.5 h-3.5 text-[#8E909A] animate-spin shrink-0 ml-1" />
        )}
        {query && !isSearching && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-[#8E909A] hover:text-[#1F2024] hover:bg-[#F2F1EC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md border border-[#E8E6DF] rounded-2xl shadow-soft-xl overflow-hidden z-[1100] max-h-[300px] overflow-y-auto">
          {results.map((item) => (
            <button
              key={`${item.place_id}-${item.osm_id}`}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3.5 py-2.5 border-b border-[#F2F1EC] last:border-0 hover:bg-[#FAF9F6] transition-colors flex items-start gap-2.5 cursor-pointer group"
            >
              <div className="mt-0.5 p-1 rounded-lg bg-[#FAF9F6] group-hover:bg-white border border-[#E8E6DF] shrink-0 transition-colors">
                {getCategoryIcon(item.category, item.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#1F2024] truncate">
                    {item.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#F2F1EC] text-[#6B6D76] shrink-0">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6D76] truncate mt-0.5 font-sans">
                  {item.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
