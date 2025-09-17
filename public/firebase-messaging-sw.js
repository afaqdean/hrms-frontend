/* eslint-disable no-undef */
/* eslint-disable no-console */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebase = globalThis.firebase.initializeApp({
  apiKey: 'AIzaSyCR9dZG1Mr7k5bkYW5WttcK9Zcfx4taKR0',
  authDomain: 'hrms-69e61.firebaseapp.com',
  projectId: 'hrms-69e61',
  storageBucket: 'hrms-69e61.firebasestorage.app',
  messagingSenderId: '124412564966',
  appId: '1:124412564966:web:5fead8c9ab60ea3961b227',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Generate a unique ID for the notification
  const notificationId = Date.now().toString();

  // Get the current locale from the URL or use a default
  let locale = 'en';
  try {
    const urlPath = globalThis.location.pathname;
    const localeMatch = urlPath.match(/^\/([a-z]{2})\//);
    if (localeMatch && localeMatch[1]) {
      locale = localeMatch[1];
    }
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error getting locale:', error);
  }

  // Customize notification here
  const notificationTitle = payload.notification.title || 'HRMS Notification';
  const notificationOptions = {
    body: payload.notification.body || 'New notification from HRMS',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: notificationId, // Use the ID as the tag to avoid duplicate notifications
    data: {
      ...payload.data,
      id: notificationId,
      url: `/${locale}/dashboard/notifications/${notificationId}?title=${encodeURIComponent(payload.notification.title)}&body=${encodeURIComponent(payload.notification.body)}&timestamp=${Date.now()}${payload.data ? `&data=${encodeURIComponent(JSON.stringify(payload.data))}` : ''}`,
      timestamp: Date.now(),
    },
    // Add actions for native-like experience
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon-32x32.png',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon-32x32.png',
      },
    ],
    // Enable vibration for mobile devices
    vibrate: [200, 100, 200],
    // For iOS
    renotify: false,
    requireInteraction: true,
    silent: false,
  };

  globalThis.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
globalThis.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click: ', event);

  // Close the notification
  event.notification.close();

  // Get notification data
  const notificationData = event.notification.data;

  // Default URL to navigate to
  let url = '/dashboard/employee/overview';

  // Handle different actions
  if (event.action === 'dismiss') {
    return; // Just close the notification
  }

  // If we have a specific URL in the notification data, use it
  if (notificationData && notificationData.url) {
    url = notificationData.url;
  }

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    globalThis.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if a window is already open
      for (const client of clientList) {
        if (client.url.includes(globalThis.registration.scope) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }

      // If no window is open, open a new one
      if (globalThis.clients.openWindow) {
        return globalThis.clients.openWindow(url);
      }
    }),
  );
});

// Handle notification close
globalThis.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed', event);
});
