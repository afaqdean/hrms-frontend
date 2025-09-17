'use client';

import { useNotification } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export function NotificationBell() {
  const {
    notificationPermission,
    requestPermission,
    notificationCount,
    notifications,
    markAllAsRead,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen && notificationCount > 0) {
      markAllAsRead();
    }
  };

  const handleRequestPermission = async () => {
    if (isEnabling) {
      return;
    } // Prevent multiple clicks
    setIsEnabling(true);
    try {
      await requestPermission();
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Notifications"
      >
        <Bell className="size-6 text-gray-600" />
        {notificationCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notificationPermission !== 'granted' && (
              <div className="border-b border-gray-200 p-4">
                <p className="mb-2 text-sm text-gray-600">
                  Enable notifications to stay updated with the latest information.
                </p>
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  disabled={isEnabling}
                  className={`rounded px-3 py-1 text-xs font-medium text-white ${
                    isEnabling
                      ? 'cursor-not-allowed bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isEnabling
                    ? (
                        <span className="flex items-center gap-2">
                          <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Enabling...
                        </span>
                      )
                    : (
                        'Enable Notifications'
                      )}
                </button>
              </div>
            )}

            {notifications.length === 0
              ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                )
              : (
                  <>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification: any) => (
                        <Link
                          key={notification._id}
                          href={`/notifications/${notification._id}?title=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(notification.body)}&timestamp=${notification.timestamp}${notification.data ? `&data=${encodeURIComponent(JSON.stringify(notification.data))}` : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div
                            className={`border-b border-gray-200 p-4 hover:bg-gray-50 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{notification.body}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {notifications.length > 5 && (
                      <div className="border-t border-gray-200 p-2 text-center">
                        <button
                          type="button"
                          onClick={handleViewAll}
                          className="w-full rounded px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        >
                          View all (
                          {notifications.length}
                          )
                        </button>
                      </div>
                    )}
                  </>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
