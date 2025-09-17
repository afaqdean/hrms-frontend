'use client';

import React from 'react';

type LoadingAlertProps = {
  title: string;
  message: string;
  showTimeout?: boolean;
  timeoutMessage?: string;
  onRefresh?: () => void;
  onContinue?: () => void;
  onRetry?: () => void;
  className?: string;
};

const LoadingAlert: React.FC<LoadingAlertProps> = ({
  title,
  message,
  showTimeout = false,
  timeoutMessage,
  onRefresh,
  onContinue,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 ${className}`}>
      <div className="flex items-center">
        <div className="mr-2 size-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800">{title}</h3>
          <p className="mt-1 text-sm text-blue-700">
            {message}
            {showTimeout && timeoutMessage && (
              <span className="mt-1 block font-medium text-orange-600">
                ⚠️
                {' '}
                {timeoutMessage}
              </span>
            )}
          </p>
          <div className="mt-2 flex gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Refresh Page
              </button>
            )}
            {showTimeout && onContinue && (
              <button
                type="button"
                onClick={onContinue}
                className="text-sm text-orange-600 underline hover:text-orange-800"
              >
                Continue Without CNIC
              </button>
            )}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAlert;
