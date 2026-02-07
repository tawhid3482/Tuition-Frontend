// src/components/navbar/SearchBar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, XCircle } from "lucide-react";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  onSearch?: (query: string) => void;
}

export default function SearchBar({ variant = "desktop", onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(variant === "mobile" ? false : true);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "mobile") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setSearchQuery("");
      if (variant === "mobile") setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  if (variant === "mobile") {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-colors duration-200"
        >
          <Search className="w-5 h-5" />
        </button>

        {isOpen && (
          <div
            className="md:hidden py-3 border-t border-gray-200 bg-white absolute top-16 left-0 right-0"
            ref={searchRef}
          >
            <div className="px-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-3"
                    >
                      <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="ml-2 px-3 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-48 lg:w-56 transition-all duration-200 text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2.5"
            >
              <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}