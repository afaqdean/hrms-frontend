import type { NotificationContextType } from '@/context/NotificationContext';
import { NotificationContext } from '@/context/NotificationContext';
import { useContext } from 'react';

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
