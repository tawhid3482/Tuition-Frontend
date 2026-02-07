/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/navbar/MobileNav.tsx
"use client";

import { useState } from "react";
import { ChevronDown, Menu, X, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavItem, User } from "./types";
import NotificationBell from "./NotificationBell";
import Image from "next/image";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  activeItem: string;
  isAuthenticated: boolean;
  user: User | null;
  notifications: any[];
  notificationsLoading: boolean;
  unreadCount: number;
  onNotificationClick: (
    notificationId: string,
    e?: React.MouseEvent,
  ) => Promise<void>;
  onMarkAllAsRead: (e: React.MouseEvent) => Promise<void>;
  refetchNotifications: () => void;
  onLogout: () => Promise<void>;
  onItemClick: (itemName: string) => void;
}

export default function MobileNav({
  isOpen,
  setIsOpen,
  navItems,
  activeItem,
  isAuthenticated,
  user,
  notifications,
  notificationsLoading,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  refetchNotifications,
  onLogout,
  onItemClick,
}: MobileNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const router = useRouter();

  const handleMobileNavigation = (href: string, itemName: string) => {
    onItemClick(itemName);
    router.push(href);
    setIsOpen(false);
  };

  const isActive = (itemName: string) => activeItem === itemName;

  return (
    <>
      <div className="flex items-center space-x-2 md:hidden">
        {isAuthenticated && (
          <NotificationBell
            isAuthenticated={isAuthenticated}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            unreadCount={unreadCount}
            onNotificationClick={onNotificationClick}
            onMarkAllAsRead={onMarkAllAsRead}
            refetchNotifications={refetchNotifications}
            variant="mobile"
          />
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200 focus:outline-none"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-40">
          <div
            className="absolute top-16 bottom-14 left-0 right-0 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 h-full">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 p-3 mb-4 bg-linear-to-r from-primary/5 to-primary/10 rounded-xl">
                  <div className="relative">
                    {user?.avatar ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="object-cover w-full h-full"
                          width={32}
                          height={32}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">
                          {user?.name
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-600 capitalize truncate">
                      {user?.role?.replace(/_/g, " ") || "User"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div
                    onClick={() => handleMobileNavigation("/login", "Login")}
                    className="w-full bg-primary text-white px-3 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login to your account</span>
                  </div>
                </div>
              )}

              <div className="space-y-0.5">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === item.name ? null : item.name,
                            )
                          }
                          className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.name)
                              ? " bg-primary/10 text-primary"
                              : "text-gray-800 hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`${isActive(item.name) ? "text-primary" : "text-gray-600"}`}
                            >
                              {item.icon}
                            </div>
                            <span className="font-medium text-sm">
                              {item.name}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen === item.name ? "rotate-180" : ""}`}
                          />
                        </button>

                        {dropdownOpen === item.name && (
                          <div className="ml-10 mt-1 mb-2 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <div
                                key={subItem.name}
                                className="px-3 py-2"
                                onClick={() => {
                                  handleMobileNavigation(
                                    subItem.href,
                                    item.name,
                                  );
                                }}
                              >
                                <div className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 group rounded-lg hover:bg-primary/5 cursor-pointer px-2 py-1.5">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <span className="font-medium text-sm">
                                    {subItem.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        onClick={() => {
                          handleMobileNavigation(item.href, item.name);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive(item.name)
                            ? " bg-primary/10 text-primary"
                            : "text-gray-800 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`${isActive(item.name) ? "text-primary" : "text-gray-600"}`}
                          >
                            {item.icon}
                          </div>
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
