import { Card, CardContent } from '@/components/ui/card';
import { useNotification } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import Avatar from './shared/avatars/avatar/Avatar';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  // This counter triggers a new bubble animation on every click
  const [bubbleTrigger, setBubbleTrigger] = useState(0);
  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  // Get the current locale from the URL or use a default
  let locale = 'en';
  try {
    const localeMatch = pathname?.match(/^\/([a-z]{2})\//);
    if (localeMatch && localeMatch[1]) {
      locale = localeMatch[1];
    }
  } catch (error) {
    console.error('Error getting locale:', error);
  }

  // Use the notification context
  const {
    notifications,
    notificationCount,
    markAllAsRead,
    markAsRead,
    notificationPermission,
    requestPermission,
  } = useNotification();

  const containerRef = useRef<any>(null);

  // Detect mobile devices and PWA mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Check if running as PWA
    const checkPWA = () => {
      // Check if the app is running in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || (window.navigator as any).standalone
        || document.referrer.includes('android-app://');
      setIsPWA(isStandalone);
    };

    checkPWA();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Listen for display mode changes (entering/exiting PWA mode)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
    };
  }, []);

  // Close panel on clicking outside the container
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current
        && !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Add listener when panel is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      // Prevent body scrolling on mobile when panel is open
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);

      // Restore body scrolling
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  // Handle PWA-specific behavior for notifications
  useEffect(() => {
    // In PWA mode, we need to ensure notifications are properly handled
    if (isPWA && 'serviceWorker' in navigator) {
      // Make sure notifications are properly registered in the service worker
      if (notificationPermission === 'granted') {
        // Ensure the notification token is up-to-date
        requestPermission().catch((error: any) => {
          console.error('Error refreshing notification permission in PWA:', error);
        });
      }
    }
  }, [isPWA, notificationPermission, requestPermission]);

  // Icon tap animation
  const iconVariants = {
    initial: { scale: 1 },
    tap: { scale: 1.1 },
  };

  // Panel animation variants
  const panelVariants = {
    hidden: isMobile
      ? { opacity: 0, y: '100%' }
      : { opacity: 0, scale: 0, x: 20, y: -20 },
    visible: isMobile
      ? {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        }
      : {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        },
    exit: isMobile
      ? { opacity: 0, y: '100%', transition: { duration: 0.3 } }
      : { opacity: 0, scale: 0, transition: { duration: 0.2 } },
  };

  // Parent variant for staggering list items
  const listVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  // Animation for each notification item
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    setBubbleTrigger(prev => prev + 1);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setIsOpen(false);
  };

  const handleRequestPermission = async () => {
    setIsEnablingNotifications(true);
    try {
      const result = await requestPermission();

      // In PWA mode, we need to handle the permission result differently
      if (isPWA && result) {
        // Force refresh the page to ensure service worker is updated with new permission
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.update();
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsEnablingNotifications(false);
    }
  };

  const handleViewAll = () => {
    router.push(`/${locale}/dashboard/notifications`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        onClick={handleButtonClick}
        className="relative cursor-pointer overflow-visible"
        variants={iconVariants}
        whileTap="tap"
        aria-label="Notifications"
      >
        {/* Chat bubble emergence effect */}
        <AnimatePresence>
          <motion.div
            key={bubbleTrigger}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-full bg-blue-200"
          />
        </AnimatePresence>

        <Avatar
          className="relative border border-gray-200 bg-white transition-colors duration-200 hover:bg-primary-100"
          icon={(
            <IoMdNotificationsOutline
              className="text-gray-600 hover:text-white"
              size={24}
            />
          )}
        />
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              z-50 
              ${
          isMobile
            ? 'fixed inset-0 flex flex-col bg-white'
            : 'absolute right-0 mt-2 w-96 origin-top-right'
          }
            `}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications panel"
          >
            {isMobile
              ? (
                // Mobile view
                  <>
                    <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      <div className="flex items-center gap-4">
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="rounded-full p-1 hover:bg-gray-200"
                          aria-label="Close notifications"
                        >
                          <IoClose size={24} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain">
                      {notificationPermission !== 'granted' && (
                        <div className="border-b border-gray-200 p-4">
                          <p className="mb-2 text-sm text-gray-600">
                            Enable notifications to stay updated with the latest information.
                          </p>
                          <button
                            type="button"
                            onClick={handleRequestPermission}
                            disabled={isEnablingNotifications}
                            className="flex items-center justify-center gap-2 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isEnablingNotifications && (
                              <svg className="size-3 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                            {isEnablingNotifications ? 'Enabling' : 'Enable Notification'}
                          </button>
                        </div>
                      )}

                      {notifications.length === 0
                        ? (
                            <div className="flex h-full items-center justify-center p-8 text-center">
                              <p className="text-gray-500">No notifications</p>
                            </div>
                          )
                        : (
                            <motion.ul
                              variants={listVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="divide-y divide-gray-200"
                            >
                              {notifications.map((notification: any) => (
                                <motion.li
                                  key={notification.id}
                                  variants={itemVariants}
                                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${
                                    !notification.read
                                      ? 'bg-blue-50'
                                      : ''
                                  }`}
                                >
                                  <Link
                                    href={`/${locale}/dashboard/notifications/${notification.id}?title=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(notification.body)}&timestamp=${notification.timestamp}${notification.data ? `&data=${encodeURIComponent(JSON.stringify(notification.data))}` : ''}`}
                                    onClick={() => handleNotificationClick(notification.id)}
                                    prefetch={isPWA} // Prefetch in PWA mode for faster navigation
                                  >
                                    <div className="flex flex-col space-y-1">
                                      <span className="font-medium text-gray-700">
                                        {notification.title}
                                      </span>
                                      <span className="line-clamp-2 text-sm text-gray-600">
                                        {notification.body}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                      </span>
                                    </div>
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                    </div>

                    <div className="border-t bg-gray-100 p-4 shadow-inner">
                      <button
                        type="button"
                        className="w-full rounded-md bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                        onClick={handleViewAll}
                      >
                        See all notifications
                      </button>
                    </div>
                  </>
                )
              : (
                // Desktop view (unchanged)
                  <Card className="overflow-hidden rounded-lg shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-2">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="scrollbar max-h-80 overflow-y-auto overflow-x-hidden">
                        {notificationPermission !== 'granted' && (
                          <div className="border-b border-gray-200 p-4">
                            <p className="mb-2 text-sm text-gray-600">
                              Enable notifications to stay updated with the latest information.
                            </p>
                            <button
                              type="button"
                              onClick={handleRequestPermission}
                              disabled={isEnablingNotifications}
                              className="flex items-center justify-center gap-2 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isEnablingNotifications && (
                                <svg className="size-3 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              )}
                              {isEnablingNotifications ? 'Enabling' : 'Enable Notifications'}
                            </button>
                          </div>
                        )}

                        {notifications.length === 0
                          ? (
                              <div className="p-8 text-center">
                                <p className="text-gray-500">No notifications</p>
                              </div>
                            )
                          : (
                              <motion.ul
                                variants={listVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="divide-y divide-gray-200"
                              >
                                {notifications.slice(0, 5).map((notification: any) => (
                                  <motion.li
                                    key={notification.id}
                                    variants={itemVariants}
                                    className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${
                                      !notification.read
                                        ? 'bg-blue-50'
                                        : ''
                                    }`}
                                  >
                                    <Link
                                      href={`/${locale}/dashboard/notifications/${notification.id}?title=${encodeURIComponent(notification.title)}&body=${encodeURIComponent(notification.body)}&timestamp=${notification.timestamp}${notification.data ? `&data=${encodeURIComponent(JSON.stringify(notification.data))}` : ''}`}
                                      onClick={() => handleNotificationClick(notification.id)}
                                      prefetch={isPWA} // Prefetch in PWA mode for faster navigation
                                    >
                                      <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-700">
                                          {notification.title}
                                        </span>
                                        <span className="line-clamp-2 text-sm text-gray-600">
                                          {notification.body}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                        </span>
                                      </div>
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                      </div>
                      <div className="border-t bg-gray-100 px-4 py-2 text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-500 hover:underline"
                          onClick={handleViewAll}
                        >
                          See all notifications
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
