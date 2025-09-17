/* eslint-disable no-console */
'use client';

import { initializeFirebaseMessaging, onMessageListener, requestNotificationPermission } from '@/libs/firebase';
import { registerFcmToken } from '@/libs/notificationUtils';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { NotificationContext, type Notification as NotificationItem } from './NotificationContext.types';

const STORAGE_KEY = 'hrms_notifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Initialize Firebase messaging and handle token refresh
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      // Check notification permission from localStorage first
      const storedPermission = localStorage.getItem('notification_permission');
      if (storedPermission) {
        setNotificationPermission(storedPermission as NotificationPermission);
      } else if ('Notification' in window) {
        // If not in localStorage, check browser permission
        const permission = Notification.permission as NotificationPermission;
        setNotificationPermission(permission);
        localStorage.setItem('notification_permission', permission);
      }

      // Initialize Firebase messaging if permission is granted
      if (storedPermission === 'granted' || Notification.permission === 'granted') {
        initializeFirebaseMessaging().then((token) => {
          if (token) {
            setFcmToken(token);
            setNotificationPermission('granted');
            localStorage.setItem('notification_permission', 'granted');
          }
        });
      }
    }
  }, [isAuthenticated]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First load from localStorage
      try {
        const storedNotifications = localStorage.getItem(STORAGE_KEY);
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications) as NotificationItem[];
          setNotifications(parsedNotifications);
          setNotificationCount(parsedNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error('Error loading notifications from localStorage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && notifications.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications to localStorage:', error);
      }
    }
  }, [notifications]);

  // Request notification permission and get FCM token
  const requestPermission = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        setNotificationPermission('granted');
        localStorage.setItem('notification_permission', 'granted');

        // Register the token with the backend
        try {
          await registerFcmToken(token);
          toast.success('Notifications enabled successfully!');
        } catch (error) {
          console.error('Failed to register FCM token with backend:', error);
          toast.error('Failed to register for notifications. Please try again.');
        }
      }
      return token;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications. Please check your browser settings.');
      return null;
    }
  };

  // Set up foreground message listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = onMessageListener((payload) => {
        console.log('Foreground message received:', payload);

        // Extract notification data
        const { notification, data } = payload;

        if (notification) {
          // Generate a unique ID for the notification
          const id = Date.now().toString();

          // Get the current locale from the URL or use a default
          let locale = 'en';
          try {
            const urlPath = window.location.pathname;
            const localeMatch = urlPath.match(/^\/([a-z]{2})\//);
            if (localeMatch && localeMatch[1]) {
              locale = localeMatch[1];
            }
          } catch (error) {
            console.error('Error getting locale:', error);
          }

          // Show toast notification
          toast.info(
            <div>
              <h4 className="font-bold">{notification.title}</h4>
              <p>{notification.body}</p>
            </div>,
            {
              position: 'top-right',
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
              onClick: () => {
                // Navigate to notification detail page when toast is clicked
                if (typeof window !== 'undefined') {
                  window.location.href = `/${locale}/dashboard/notifications/${id}?title=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(notification.body)}&timestamp=${Date.now()}${data ? `&data=${encodeURIComponent(JSON.stringify(data))}` : ''}`;
                }
              },
            },
          );

          // Add to notifications list
          const newNotification: NotificationItem = {
            id,
            title: notification.title,
            body: notification.body,
            timestamp: Date.now(),
            read: false,
            data,
          };

          // Store notification in localStorage for individual access
          try {
            localStorage.setItem(`notification_${id}`, JSON.stringify(newNotification));
          } catch (error) {
            console.error('Error storing notification in localStorage:', error);
          }

          setNotifications(prev => [newNotification, ...prev]);
          setNotificationCount(prev => prev + 1);
        }

        // Add explicit return to satisfy TypeScript
        return undefined;
      });

      return () => {
        unsubscribe();
      };
    }

    // Add return for when window is undefined
    return undefined;
  }, []);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true })),
    );
    setNotificationCount(0);
  };

  // Mark a specific notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);

    // Clear notifications from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);

        // Also clear individual notification entries
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('notification_')) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.error('Error clearing notifications from localStorage:', error);
      }
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    fcmToken,
    notificationPermission,
    requestPermission,
    notificationCount,
    notifications,
    markAllAsRead,
    markAsRead,
    clearNotifications,
  }), [
    fcmToken,
    notificationPermission,
    notificationCount,
    notifications,
    // Note: We don't include function references in the dependency array
    // as they are stable references (not recreated on each render)
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Re-export types and context for use in other files
export type { Notification, NotificationContextType } from './NotificationContext.types';
export { NotificationContext } from './NotificationContext.types';
