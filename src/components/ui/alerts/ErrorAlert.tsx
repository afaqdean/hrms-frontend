'use client';

import React from 'react';

type ErrorAlertProps = {
  title: string;
  message: string;
  errorDetails?: string;
  additionalMessage?: string;
  onRefresh?: () => void;
  onRetry?: () => void;
  className?: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  errorDetails,
  additionalMessage,
  onRefresh,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 ${className}`}>
      <div className="flex items-center">
        <svg className="mr-2 size-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          <p className="mt-1 text-sm text-yellow-700">{message}</p>
          {errorDetails && (
            <p className="mt-1 text-sm text-yellow-600">
              Error:
              {' '}
              {errorDetails}
            </p>
          )}
          {additionalMessage && (
            <p className="mt-1 text-sm text-yellow-700">{additionalMessage}</p>
          )}
        </div>
        <div className="ml-4 flex flex-col gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
            >
              Refresh Page
            </button>
          )}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200"
            >
              Retry CNIC
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
