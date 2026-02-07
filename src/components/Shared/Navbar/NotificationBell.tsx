// src/components/navbar/NotificationBell.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Notification } from "./types";

interface NotificationBellProps {
  isAuthenticated: boolean;
  notifications: Notification[];
  notificationsLoading: boolean;
  unreadCount: number;
  onNotificationClick: (notificationId: string, e?: React.MouseEvent) => Promise<void>;
  onMarkAllAsRead: (e: React.MouseEvent) => Promise<void>;
  refetchNotifications: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
}

export default function NotificationBell({
  isAuthenticated,
  notifications,
  notificationsLoading,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  className = "",
  variant = "desktop",
}: NotificationBellProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId: string, e: React.MouseEvent) => {
    await onNotificationClick(notificationId, e);
  };

  if (!isAuthenticated) return null;

  return (
    <div className={`relative ${className}`} ref={notificationRef}>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className="relative p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all duration-200"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      {notificationOpen && (
        <div className={`absolute ${variant === 'desktop' ? 'right-0 mt-2' : '-right-4 -top-4 mt-2'} w-80 bg-white rounded-lg shadow-xl border z-50`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setNotificationOpen(false)}
                className="text-gray-500 hover:text-gray-700 ml-2"
                aria-label="Close notifications"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto ">
            {notificationsLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                No notifications ye
              </p>
            ) : (
              notifications.slice(0, variant === 'mobile' ? 5 : 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={(e) => handleNotificationClick(notification.id, e)}
                >
                  <h4 className={`font-medium ${variant === 'mobile' ? 'text-sm' : ''}`}>
                    {notification.notification?.title || notification.title || "Notification"}
                  </h4>
                  <p className={`text-gray-600 mt-1 ${variant === 'mobile' ? 'text-xs line-clamp-2' : 'text-sm'}`}>
                    {notification.notification?.message || 
                     notification.message || 
                     "No message"}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {notification.createdAt ? 
                        new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        "Recently"}
                    </span>
                    {!notification.isRead && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Link
                href="/notifications"
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex justify-center"
                onClick={() => setNotificationOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}