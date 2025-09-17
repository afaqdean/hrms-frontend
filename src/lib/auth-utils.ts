'use client';

import { signOut as nextAuthSignOut } from 'next-auth/react';
import { cookieUtils } from './cookie-utils';

/**
 * Handles authentication errors (like 401 Unauthorized) by signing out the user
 * and redirecting to the sign-in page.
 */
export const handleAuthError = async (): Promise<void> => {
  try {
    // Clear cookies and localStorage
    cookieUtils.clearAuthCookies();

    // Call NextAuth signOut
    await nextAuthSignOut({ redirect: false }).catch((err) => {
      console.error('NextAuth signOut error:', err);
    });

    // Show a notification to the user (if a notification system is available)
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('auth-error', {
        detail: { message: 'Your session has expired. Please sign in again.' },
      }));
    }

    // Redirect to sign-in page
    // Use a small delay to allow any cleanup to complete
    setTimeout(() => {
      window.location.href = '/sign-in';
    }, 100);
  } catch (error) {
    console.error('Error during auth error handling:', error);
    // Force redirect on error
    window.location.href = '/sign-in';
  }
};

/**
 * Manually triggers a sign out process.
 * This can be used from anywhere in the application.
 */
export const manualSignOut = async (): Promise<void> => {
  await handleAuthError();
};
