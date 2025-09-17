'use client';

import { useEffect, useState } from 'react';

export function AuthErrorNotification() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Your session has expired. Please sign in again.');

  useEffect(() => {
    // Listen for auth-error events
    const handleAuthError = (event: CustomEvent) => {
      if (event.detail?.message) {
        setMessage(event.detail.message);
      }
      setVisible(true);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };

    // Add event listener
    window.addEventListener('auth-error', handleAuthError as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 max-w-md animate-fade-in rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-lg">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 size-5 text-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 text-red-600 hover:text-red-800"
        aria-label="Close notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
