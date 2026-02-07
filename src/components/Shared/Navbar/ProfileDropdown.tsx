// src/components/navbar/ProfileDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, Bell, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "./types";

interface ProfileDropdownProps {
  user: User | null;
  unreadCount: number;
  onLogout: () => Promise<void>;
  onProfileDropdownClose?: () => void;
}

export default function ProfileDropdown({
  user,
  unreadCount,
  onLogout,
  onProfileDropdownClose,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onProfileDropdownClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onProfileDropdownClose]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await onLogout();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:opacity-90 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          {user?.avatar ? (
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 lg:h-9 lg:w-9 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-xs lg:text-sm">
                {user?.name ? getInitials(user.name) : "U"}
              </span>
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 lg:h-3 lg:w-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-30">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role?.replace(/_/g, " ") || "User"}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link
            href="/notifications"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            <Bell className="w-4 h-4 mr-3" />
            <span className="font-medium text-sm">All Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}