"use client";

import { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, ChevronDown, Bell, Search, XCircle } from 'lucide-react';
import Image from 'next/image';
import Logo from "../../../app/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const navItems = [
    { name: 'Home', icon: <Home className="w-4 h-4" />, href: '#' },
    { name: 'About', icon: <User className="w-4 h-4" />, href: '#' },
    {
      name: 'Services',
      icon: <Briefcase className="w-4 h-4" />,
      href: '#',
      dropdown: [
        { name: 'Web Development', href: '#' },
        { name: 'Mobile Apps', href: '#' },
        { name: 'UI/UX Design', href: '#' },
        { name: 'Consulting', href: '#' }
      ]
    },
    { name: 'Contact', icon: <Mail className="w-4 h-4" />, href: '#' },
  ];

  // Handle click outside for search on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (window.innerWidth < 768) {
          setSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">

          {/* Logo and Desktop Navigation */}
          <div className="flex items-center flex-1">
            {/* Logo - Professional Design */}
            <div className="shrink-0">
              <div className="flex items-center">
                <div className="relative h-10 w-32 md:h-12 md:w-40">
                  <Image
                    src={Logo}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 120px, 160px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on medium screens */}
            <div className="hidden lg:flex lg:ml-10 lg:items-center lg:space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        className="flex items-center space-x-2 text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium py-2 text-sm uppercase tracking-wide"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <span className="relative group">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300"></span>
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {dropdownOpen && (
                        <div
                          className="absolute top-full left-0 w-56 bg-white rounded shadow-xl py-3 border border-gray-100 z-50"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          {item.dropdown.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="flex items-center px-5 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                              <span className="font-medium">{subItem.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-800 hover:text-blue-700 transition-colors duration-200 font-medium py-2 text-sm uppercase tracking-wide group"
                    >
                      {item.icon}
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300"></span>
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
                    className="pl-10 pr-9 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-56 transition-all duration-200 text-sm"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
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
              </form>
            </div>

            {/* Notification - Professional Design */}
            <button className="relative p-2.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile - Professional Design */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="relative">
                <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>

          {/* Mobile Search & Menu - Show on small screens */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Professional Design */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 bg-white" ref={searchRef}>
            <div className="container mx-auto px-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-3.5"
                    >
                      <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="ml-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
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
          <div className="flex items-center justify-center space-x-8 py-3 px-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 transition-colors duration-200 font-medium text-sm group relative"
              >
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  {item.icon}
                </div>
                <span className="hidden sm:inline font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu - Professional Design */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full left-0 right-0 shadow-xl z-40 max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-4">
            {/* Mobile Profile Section */}
            <div className="flex items-center space-x-4 p-4 mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">john.doe@company.com</p>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                  <a
                    href={item.href}
                    className="flex items-center justify-between px-4 py-4 rounded-xl text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    onClick={() => !item.dropdown && setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 group-hover:text-blue-700">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    )}
                  </a>

                  {/* Mobile dropdown - Professional Design */}
                  {item.dropdown && (
                    <div className="ml-12 mt-1 mb-3 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center px-4 py-2.5 text-gray-600 hover:text-blue-700 transition-colors duration-200 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="font-medium">{subItem.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Footer Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <span>Dashboard</span>
              </button>
              <button className="w-full mt-3 border border-gray-300 text-gray-700 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;