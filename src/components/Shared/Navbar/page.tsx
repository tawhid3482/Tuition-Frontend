"use client";

import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Mail,
  ChevronDown,
  Search,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Logo</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          {item.dropdown.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side items - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Notification */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
              <span className="text-gray-700 font-medium">John Doe</span>
            </div>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {item.dropdown && <ChevronDown className="w-4 h-4 ml-auto" />}
                </a>

                {/* Mobile dropdown */}
                {item.dropdown && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        • {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTA Button */}
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// const Navbar: React.FC = () => {
//   const pathname = usePathname(); // current route

//   const navItems = [
//     { name: "Home", href: "/" },
//     { name: "Services", href: "/services" },
//     { name: "Contact", href: "/contact" },
//   ];

//   const isActive = (href: string) => pathname === href;

//   return (
//     <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
//       {/* Navbar Start */}
//       <div className="navbar-start">
//         <Link
//           href="/"
//           className="btn btn-ghost text-xl font-bold text-primary"
//         >
//           CodeBase
//         </Link>
//       </div>

//       {/* Navbar Center */}
//       <div className="navbar-center hidden lg:flex">
//         <ul className="menu menu-horizontal px-1">
//           {navItems.map((item) => (
//             <li key={item.href}>
//               <Link
//                 href={item.href}
//                 className={`${
//                   isActive(item.href) ? "active font-bold" : "text-secondary"
//                 } hover:text-accent transition-colors`}
//               >
//                 {item.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Navbar End */}
//       <div className="navbar-end">
//         <Link href="/login">
//           <button className="btn btn-secondary text-white">Login</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
