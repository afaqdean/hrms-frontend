/* eslint-disable no-console */
import { getApp, getApps, initializeApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { registerFcmToken } from './notificationUtils';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Cloud Messaging
let messaging: any;

// Initialize messaging only on the client side and if supported
if (typeof window !== 'undefined') {
  isSupported().then((isSupported) => {
    if (isSupported) {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.error('Firebase messaging initialization error:', error);
      }
    } else {
      console.log('Firebase messaging is not supported in this browser');
    }
  });
}

/**
 * Request permission for notifications and get FCM token
 * @returns Promise with the FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.log('Firebase messaging is not initialized');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Delete any existing tokens before getting a new one
    try {
      const currentToken = await getToken(messaging);
      if (currentToken) {
        await deleteToken(messaging);
      }
    } catch (error) {
      console.error('Error deleting existing token:', error);
    }

    // Get new FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('New FCM Token:', token);
      // Register the token with your backend
      try {
        await registerFcmToken(token);
        console.log('FCM token registered with backend successfully');
      } catch (error) {
        console.error('Error registering FCM token with backend:', error);
      }
      return token;
    } else {
      console.log('No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Set up a listener for foreground messages
 * @param callback Function to handle received messages
 */
export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

/**
 * Initialize Firebase Cloud Messaging
 * This should be called when the app starts
 */
export const initializeFirebaseMessaging = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      console.log('Firebase messaging is not supported in this browser');
      return;
    }

    // Check if we already have permission
    if (Notification.permission === 'granted') {
      const token = await requestNotificationPermission();
      return token;
    }
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
  }
  return null;
};

export { app };
