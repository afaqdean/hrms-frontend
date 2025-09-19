/* eslint-disable style/multiline-ternary */
'use client';

import { useNotification } from '@/hooks';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Calendar, Clock, Copy, Info } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

type NotificationData = {
  id: string;
  title: string;
  body: string;
  message?: string;
  createdAt?: string;
  timestamp?: number;
  data?: Record<string, any>;
};

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
    <div className="mb-4 space-y-3">
      <h3 className="text-base font-medium text-gray-800">Test Browser Notification</h3>

      {!isNotificationSupported && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
          Your browser doesn't support notifications. Try using Chrome, Firefox, or Safari.
        </div>
      )}

      <div className="mb-4 space-y-3">
        <div>
          <label htmlFor="test-title" className="mb-1 block text-sm font-medium text-gray-700">
            Title
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
            Message
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

function NotificationDetailPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { markAsRead, fcmToken, requestPermission } = useNotification();
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    // Try to get notification data from URL parameters
    const id = params.id as string;
    const title = searchParams.get('title');
    const body = searchParams.get('body');
    const timestamp = searchParams.get('timestamp');

    // Try to parse additional data if available
    let data: Record<string, any> | undefined;
    try {
      const dataParam = searchParams.get('data');
      if (dataParam) {
        data = JSON.parse(dataParam);
      }
    } catch (error) {
      console.error('Error parsing notification data:', error);
    }

    if (id && title && body) {
      setNotification({
        id,
        title,
        body,
        timestamp: timestamp ? Number.parseInt(timestamp, 10) : Date.now(),
        data,
      });

      // Mark the notification as read
      markAsRead(id);
    } else {
      // If URL parameters are not available, try to get from localStorage
      try {
        const storedNotification = localStorage.getItem(`notification_${id}`);
        if (storedNotification) {
          const parsedNotification = JSON.parse(storedNotification);
          setNotification(parsedNotification);

          // Mark the notification as read
          markAsRead(id);
        }
      } catch (error) {
        console.error('Error retrieving notification from localStorage:', error);
      }
    }

    setLoading(false);
  }, [params.id, searchParams, markAsRead]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
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

  // Toggle developer tools with a secret tap sequence
  const handleDevToolsToggle = () => {
    setShowDevTools(!showDevTools);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header with back button */}
      <div className="mb-8 flex items-center">
        <Link
          href="/dashboard/notifications"
          className="mr-4 inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Notification Details</h1>

        {/* Hidden button to toggle dev tools - tap 5 times to show */}
        <button
          type="button"
          className="ml-auto opacity-0"
          onClick={handleDevToolsToggle}
          aria-hidden="true"
        >
          Dev Tools
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-8 h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-3 h-4 w-full rounded bg-gray-200"></div>
            <div className="mb-3 h-4 w-full rounded bg-gray-200"></div>
            <div className="mb-8 h-4 w-2/3 rounded bg-gray-200"></div>
            <div className="h-32 w-full rounded bg-gray-200"></div>
          </div>
        </div>
      ) : notification ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-lg bg-white shadow-sm"
        >
          {/* Notification header */}
          <div className="border-b border-gray-100 bg-white p-6">
            <motion.h2
              variants={itemVariants}
              className="mb-2 text-xl font-semibold text-gray-900"
            >
              {notification.title}
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center text-sm text-gray-500"
            >
              <div className="mr-6 flex items-center">
                <Calendar className="mr-1.5 size-4 text-gray-400" />
                {notification.timestamp
                  ? format(new Date(notification.timestamp), 'MMMM d, yyyy')
                  : 'Unknown date'}
              </div>

              <div className="flex items-center">
                <Clock className="mr-1.5 size-4 text-gray-400" />
                {notification.timestamp
                  ? format(new Date(notification.timestamp), 'h:mm a')
                  : 'Unknown time'}
              </div>
            </motion.div>
          </div>

          {/* Notification body */}
          <motion.div
            variants={itemVariants}
            className="p-6"
          >
            {/* Message container with elegant styling */}
            <div className="relative">
              {/* Subtle decorative element */}
              <div className="absolute -left-2 top-0 h-full w-1 rounded-full bg-primary"></div>

              {/* Main message content */}
              <div className="ml-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 shadow-inner">
                {/* Message header */}
                <div className="mb-4 flex items-center">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                    <Bell className="size-4 text-white" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">Message</span>
                </div>

                {/* Message body with enhanced typography */}
                <div className="prose prose-gray max-w-none">
                  <div className="relative">
                    <p className="whitespace-pre-line text-base leading-relaxed text-gray-800 selection:bg-blue-100 selection:text-blue-900">
                      {notification.body}
                    </p>

                  </div>
                </div>

                {/* Message footer with subtle styling */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200/50 pt-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="size-2 rounded-full bg-green-400"></div>
                    <span className="ml-2">Delivered</span>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

          {/* FCM Token Developer Tools (hidden by default) */}
          {showDevTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 bg-gray-50 p-6"
            >
              <div className="mb-4 flex items-center">
                <Info className="mr-2 size-5 text-orange-500" />
                <h3 className="text-lg font-medium text-gray-900">Notification Testing Tools</h3>
              </div>

              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-base font-medium text-gray-800">FCM Token (PWA & Native Apps)</h3>
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
                  <div className="mt-2 break-all font-mono">
                    {fcmToken || 'No FCM token available. Click "Copy" to request one.'}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Note: FCM tokens may not work in mobile browsers. Use the browser notification tester below.</p>
                </div>
              </div>

              {/* Mobile Browser Notification Tester */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <MobileBrowserNotificationTester />
              </div>

              <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
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
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-lg bg-white py-16 text-center shadow-sm"
        >
          <Bell className="mb-4 size-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-700">Notification Not Found</h2>
          <p className="mb-8 max-w-md text-gray-500">
            The notification you're looking for could not be found or has expired.
          </p>
          <Link
            href="/dashboard/notifications"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Notifications
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default function NotificationDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationDetailPageContent />
    </Suspense>
  );
}
