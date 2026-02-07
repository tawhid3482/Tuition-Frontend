/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Menu, X, Home, User, Briefcase, Mail, ChevronDown,
  Bell, Search, XCircle, LayoutDashboard, LogOut
} from 'lucide-react';
import Image from 'next/image';
import Logo from "../../../app/assets/logo.png";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [bottomDropdownOpen, setBottomDropdownOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('Home');
  const searchRef = useRef<HTMLDivElement>(null);
  const bottomDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', icon: <Home className="w-4 h-4" />, href: '/', exact: true },
    { name: 'About', icon: <User className="w-4 h-4" />, href: '/about' },
    {
      name: 'Services',
      icon: <Briefcase className="w-4 h-4" />,
      href: '/services',
      dropdown: [
        { name: 'Web Development', href: '/services/web-development' },
        { name: 'Mobile Apps', href: '/services/mobile-apps' },
        { name: 'UI/UX Design', href: '/services/ui-ux' },
        { name: 'Consulting', href: '/services/consulting' }
      ]
    },
    { name: 'Contact', icon: <Mail className="w-4 h-4" />, href: '/contact' },
  ];

  // Set active item based on current path
  useEffect(() => {
    const currentItem = navItems.find(item => {
      if (item.exact) {
        return pathname === item.href;
      }
      return pathname.startsWith(item.href);
    });
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [pathname]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For mobile search
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (window.innerWidth < 768) {
          setSearchOpen(false);
        }
      }

      // For bottom navigation dropdown
      if (bottomDropdownRef.current && !bottomDropdownRef.current.contains(event.target as Node)) {
        setBottomDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchOpen(false);
    }
  };

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsOpen(false);
    setDropdownOpen(null);
    setBottomDropdownOpen(null);
  };

  const toggleDropdown = (itemName: string, type: 'navbar' | 'bottom') => {
    if (type === 'navbar') {
      setDropdownOpen(dropdownOpen === itemName ? null : itemName);
      setBottomDropdownOpen(null); // Close bottom dropdown when opening navbar dropdown
    } else {
      setBottomDropdownOpen(bottomDropdownOpen === itemName ? null : itemName);
      setDropdownOpen(null); // Close navbar dropdown when opening bottom dropdown
    }
  };

  // Dynamic active class based on item name
  const isActive = (itemName: string) => activeItem === itemName;

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">

            {/* Logo and Desktop Navigation */}
            <div className="flex items-center flex-1">
              {/* Logo - Professional Design */}
              <div className="relative h-10 w-20 md:h-12 md:w-28 lg:h-16 lg:w-32">
                <Image
                  src={Logo}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 80px, (max-width: 1024px) 112px, 128px"
                  priority
                />
              </div>

              {/* Desktop Navigation - Hidden on medium screens */}
              <div className="hidden lg:flex lg:ml-10 lg:items-center lg:space-x-8">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.dropdown ? (
                      <div className="relative">
                        <button
                          className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${isActive(item.name)
                            ? ' text-primary'
                            : 'text-gray-700 hover:text-primary'
                            }`}
                          onMouseEnter={() => setDropdownOpen(item.name)}
                          onMouseLeave={() => setDropdownOpen(null)}
                          onClick={() => handleItemClick(item.name)}
                        >
                          <span className="relative">
                            {item.name}
                            <span
                              className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(item.name) ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}
                            ></span>
                          </span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen === item.name ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen === item.name && (
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-lg shadow-xl py-3 border border-gray-100 z-50 mt-1"
                            onMouseEnter={() => setDropdownOpen(item.name)}
                            onMouseLeave={() => setDropdownOpen(null)}
                          >
                            {item.dropdown.map((subItem) => (
                              <a
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-center px-5 py-2.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                                onClick={() => handleItemClick(item.name)}
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                <span className="font-medium text-sm">{subItem.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${isActive(item.name)
                          ? ' text-primary'
                          : 'text-gray-700 hover:text-primary'
                          }`}
                        onClick={() => handleItemClick(item.name)}
                      >
                        <div className={isActive(item.name) ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}>
                          {item.icon}
                        </div>
                        <span className="relative">
                          {item.name}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(item.name) ? 'w-full' : 'w-0 group-hover:w-full'
                              }`}
                          ></span>
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Desktop (768px+) */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {/* Search - Professional Design */}
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
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Notification - Professional Design */}
              <button className="relative p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all duration-200 group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Profile - Professional Design */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="relative">
                  <div className="h-8 w-8 lg:h-9 lg:w-9 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-xs lg:text-sm">JD</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 lg:h-3 lg:w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>

            {/* Mobile Search & Menu - Show on small screens */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Mobile Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200 focus:outline-none"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Professional Design */}
          {searchOpen && (
            <div className="md:hidden py-3 border-t border-gray-200 bg-white" ref={searchRef}>
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
                        onClick={() => setSearchQuery('')}
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
        </div>

        {/* Medium Screen Navigation (768px - 1024px) - Professional Design */}
        <div className="hidden md:flex lg:hidden border-t border-gray-100 bg-gray-50/50">
          <div className="w-full">
            <div className="flex items-center justify-center space-x-6 py-2 px-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 font-medium text-xs transition-all duration-200 group relative px-2 py-1.5 rounded-lg ${isActive(item.name)
                    ? ' bg-primary/10 text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  onClick={() => handleItemClick(item.name)}
                >
                  <div className="text-gray-600 group-hover:text-primary">
                    {item.icon}
                  </div>
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Separate Dropdown Logic */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-14 px-1">
          {navItems.map((item) => (
            <div key={item.name} className="relative flex-1" ref={bottomDropdownRef}>
              <button
                onClick={() => {
                  if (item.dropdown) {
                    toggleDropdown(item.name, 'bottom');
                  } else {
                    handleItemClick(item.name);
                  }
                }}
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative mx-1 rounded-lg ${isActive(item.name)
                  ? ' bg-primary/5'
                  : 'hover:bg-primary/5'
                  }`}
              >
                <div className={`relative mb-0.5 transition-transform duration-200 ${isActive(item.name) ? '-translate-y-0.5' : ''}`}>
                  <div className={isActive(item.name) ? 'text-primary' : 'text-gray-600'}>
                    {item.icon}
                  </div>
                  {isActive(item.name) && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full"></div>
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive(item.name) ? 'text-primary' : 'text-gray-600'
                  }`}>
                  {item.name}
                </span>
              </button>

              {/* Separate Bottom Navigation Dropdown */}
              {item.dropdown && bottomDropdownOpen === item.name && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                  {item.dropdown.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                      onClick={() => {
                        handleItemClick(item.name);
                        setBottomDropdownOpen(null);
                      }}
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="font-medium text-xs">{subItem.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay - Separate Dropdown Logic */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute top-16 bottom-14 left-0 right-0 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 h-full">
              {/* Mobile Profile Section - Compact */}
              <div className="flex items-center space-x-3 p-3 mb-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">JD</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">John Doe</p>
                  <p className="text-xs text-gray-600">Admin</p>
                </div>
                <button className="p-1.5 text-gray-600 hover:text-primary">
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Navigation Items - Separate Dropdown Logic */}
              <div className="space-y-0.5">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => {
                        if (item.dropdown) {
                          toggleDropdown(item.name, 'navbar');
                        } else {
                          handleItemClick(item.name);
                        }
                      }}
                      className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 ${isActive(item.name)
                        ? ' bg-primary/10 text-primary'
                        : 'text-gray-800 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${isActive(item.name) ? 'text-primary' : 'text-gray-600'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      {item.dropdown && (
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen === item.name ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Navbar Mobile Dropdown - Separate from Bottom */}
                    {item.dropdown && dropdownOpen === item.name && (
                      <div className="ml-10 mt-1 mb-2 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-3 py-2 text-gray-600 hover:text-primary transition-colors duration-200 group rounded-lg hover:bg-primary/5"
                            onClick={() => handleItemClick(item.name)}
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="font-medium text-sm">{subItem.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Footer Actions - Compact */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full bg-primary text-white px-3 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow flex items-center justify-center space-x-2 mb-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;