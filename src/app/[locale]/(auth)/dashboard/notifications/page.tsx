'use client';

import { useNotification } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bell, CheckCircle, Copy, Filter, Search, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

// Mobile Browser Notification Tester Component
const MobileBrowserNotificationTester = () => {
  const [testTitle, setTestTitle] = useState('Test Notification');
  const [testBody, setTestBody] = useState('This is a test notification message');
  const [notificationStatus, setNotificationStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Check if browser notifications are supported
  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;

  const handleTestNotification = async () => {
    if (!isNotificationSupported) {
      setNotificationStatus({
        status: 'error',
        message: 'Notifications are not supported in this browser',
      });
      return;
    }

    try {
      // Request permission if not granted
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setNotificationStatus({
            status: 'error',
            message: 'Notification permission denied',
          });
          return;
        }
      }

      // Create and show the notification
      const notification = new Notification(testTitle, {
        body: testBody,
        icon: '/icons/icon-192x192.png', // Adjust path to your app icon
        badge: '/icons/icon-192x192.png',
      });

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setNotificationStatus({
        status: 'success',
        message: 'Test notification sent successfully!',
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setNotificationStatus({ status: 'idle', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      setNotificationStatus({
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-base font-medium text-gray-800">Test Notification Generator</h3>

      {!isNotificationSupported && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
          Your browser doesn't support notifications. Try using Chrome, Firefox, or Safari.
        </div>
      )}

      <div className="mb-4 space-y-3">
        <div>
          <label htmlFor="test-title" className="mb-1 block text-sm font-medium text-gray-700">
            Notification Title
          </label>
          <input
            id="test-title"
            type="text"
            value={testTitle}
            onChange={e => setTestTitle(e.target.value)}
            className="block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter notification title"
          />
        </div>

        <div>
          <label htmlFor="test-body" className="mb-1 block text-sm font-medium text-gray-700">
            Notification Message
          </label>
          <textarea
            id="test-body"
            value={testBody}
            onChange={e => setTestBody(e.target.value)}
            className="block h-20 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter notification message"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleTestNotification}
          disabled={!isNotificationSupported}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Send Test Notification
        </button>

        {notificationStatus.status !== 'idle' && (
          <span className={`ml-3 text-sm ${
            notificationStatus.status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
          >
            {notificationStatus.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const {
    notifications,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    fcmToken,
    requestPermission,
    notificationPermission,
  } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [_devModeClicks, setDevModeClicks] = useState(0);

  // Filter notifications based on search term and read/unread filter
  const filteredNotifications = notifications
    .filter((notification: any) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          notification.title.toLowerCase().includes(searchLower)
          || notification.body.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((notification: any) => {
      // Apply read/unread filter
      if (filter === 'read') {
        return notification.read;
      }
      if (filter === 'unread') {
        return !notification.read;
      }
      return true;
    });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleClearConfirm = () => {
    setShowConfirmClear(true);
  };

  const handleClearCancel = () => {
    setShowConfirmClear(false);
  };

  const handleClearAll = () => {
    clearNotifications();
    setShowConfirmClear(false);
  };

  const handleDevModeClick = () => {
    setDevModeClicks((prev) => {
      const newCount = prev + 1;
      // Show dev tools after 5 clicks
      if (newCount >= 5) {
        setShowDevTools(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleCopyToken = async () => {
    if (fcmToken) {
      try {
        await navigator.clipboard.writeText(fcmToken);
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy token:', error);
      }
    } else {
      // If no token exists, request permission to get one
      await requestPermission();
    }
  };

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header with back button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/dashboard/employee/overview"
            className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        </div>

        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <>
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                <CheckCircle className="mr-1.5 size-4" />
                Mark all as read
              </button>

              <button
                type="button"
                onClick={handleClearConfirm}
                className="flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 className="mr-1.5 size-4" />
                Clear all
              </button>
            </>
          )}

          {/* Hidden dev mode button - tap 5 times to activate */}
          <button
            type="button"
            onClick={handleDevModeClick}
            className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Developer settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* Developer Tools Panel */}
      <AnimatePresence>
        {showDevTools && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-lg border border-orange-200 bg-orange-50"
          >
            <div className="border-b border-orange-200 bg-orange-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-orange-800">Notification Testing Tools</h2>
                <button
                  type="button"
                  onClick={() => setShowDevTools(false)}
                  className="rounded-full p-1 text-orange-600 hover:bg-orange-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* FCM Token Section */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-base font-medium text-gray-800">FCM Token (PWA & Native Apps)</h3>
                <div className="mb-4">
                  <div className="mb-2 flex items-center">
                    <span className="mr-2 font-medium text-gray-700">Notification Permission:</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      notificationPermission === 'granted'
                        ? 'bg-green-100 text-green-800'
                        : notificationPermission === 'denied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                    >
                      {notificationPermission || 'Not requested'}
                    </span>
                  </div>

                  {notificationPermission !== 'granted' && (
                    <button
                      type="button"
                      onClick={handleRequestPermission}
                      className="mt-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Request Permission
                    </button>
                  )}
                </div>

                <div className="mb-4 rounded-md bg-gray-800 p-4 text-sm text-white">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">Your FCM Token:</span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="flex items-center rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Copy className="mr-1 size-3" />
                      {tokenCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="mt-2 break-all font-mono text-xs">
                    {fcmToken || 'No FCM token available. Click "Copy" to request one.'}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p className="mb-1">
                    <strong>Note:</strong>
                    {' '}
                    FCM tokens may not work in mobile browsers. Use the test notification generator below for browser testing.
                  </p>
                </div>
              </div>

              {/* Mobile Browser Test Notification Generator */}
              <MobileBrowserNotificationTester />

              {/* Firebase Testing Campaign Instructions */}
              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium">Testing Options:</p>
                <ol className="ml-4 mt-2 list-decimal">
                  <li className="mb-1">
                    <strong>PWA/Native App:</strong>
                    {' '}
                    Copy the FCM token above and use with Firebase console
                  </li>
                  <li className="mb-1">
                    <strong>Mobile Browser:</strong>
                    {' '}
                    Use the test notification generator above
                  </li>
                  <li className="mb-1">
                    <strong>Firebase Test Campaign:</strong>
                    {' '}
                    In Firebase Console, use "Send test message" with your app package name
                  </li>
                  <li>
                    <strong>Topic-based Testing:</strong>
                    {' '}
                    Subscribe to a test topic in your app and send to that topic
                  </li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            <Filter className="mr-1.5 inline size-4" />
            Filter:
          </span>
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'read' | 'unread')}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications list */}
      {filteredNotifications.length === 0
        ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow-sm">
              <Bell className="mb-4 size-16 text-gray-300" />
              <h2 className="mb-2 text-xl font-semibold text-gray-700">No notifications found</h2>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all'
                  ? 'Try changing your search or filter settings'
                  : 'You don\'t have any notifications at the moment'}
              </p>
            </div>
          )
        : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification: any) => (
                  <motion.li
                    key={notification.id}
                    variants={itemVariants}
                    className={`transition-colors duration-200 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <Link
                      href={`/dashboard/notifications/${notification.id}?title=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(notification.body)}&timestamp=${notification.timestamp}${notification.data ? `&data=${encodeURIComponent(JSON.stringify(notification.data))}` : ''}`}
                      className="block p-4 hover:bg-gray-50"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="mb-2 sm:mb-0 sm:pr-4">
                          <h3 className={`text-base font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                            {notification.body}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                          {!notification.read && (
                            <span className="ml-2 inline-flex size-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

      {/* Confirmation modal for clearing notifications */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
              <h3 className="mb-4 text-lg font-medium text-gray-900">Clear all notifications?</h3>
              <p className="mb-6 text-sm text-gray-500">
                This action cannot be undone. All notifications will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClearCancel}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
