import { createContext } from 'react';

export type NotificationContextType = {
  fcmToken: string | null;
  notificationPermission: NotificationPermission | null;
  requestPermission: () => Promise<string | null>;
  notificationCount: number;
  notifications: Notification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  data?: any;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
