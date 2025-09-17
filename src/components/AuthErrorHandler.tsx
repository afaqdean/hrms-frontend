'use client';

import { AuthErrorNotification } from './ui/AuthErrorNotification';

/**
 * This component handles authentication errors by listening for 401 responses
 * and displaying a notification when the user is automatically signed out.
 */
export function AuthErrorHandler() {
  return <AuthErrorNotification />;
}
