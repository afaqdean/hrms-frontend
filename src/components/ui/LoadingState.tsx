'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

type LoadingStateProps = {
  message: string;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  type?: 'loading' | 'empty' | 'error';
  icon?: string;
  showSpinner?: boolean;
  contextText?: string;
  title?: string;
  actionText?: string;
  onAction?: () => void;
  showActionButton?: boolean;
};

const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  className = '',
  spinnerSize = 'md',
  fullScreen = false,
  type = 'loading',
  icon,
  showSpinner,
  contextText,
  title,
  actionText,
  onAction,
  showActionButton = true,
}) => {
  const spinnerSizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  };

  const containerClasses = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex h-full items-center justify-center';

  // Default icons for different states
  const defaultIcons = {
    loading: '',
    empty: '',
    error: '',
  };

  const displayIcon = icon || defaultIcons[type];
  const shouldShowSpinner = showSpinner !== undefined ? showSpinner : type === 'loading';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="mb-4 text-4xl">{displayIcon}</div>
        {shouldShowSpinner && (
          <div className={`mx-auto mb-4 ${spinnerSizeClasses[spinnerSize]} animate-spin rounded-full border-2 border-primary-100 border-t-transparent`} />
        )}

        {title && (
          <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        )}

        <p className="text-gray-600">{message}</p>

        {contextText && (
          <p className="mt-1 text-sm text-gray-500">{contextText}</p>
        )}

        {actionText && onAction && showActionButton && (
          <Button
            variant="outline"
            onClick={onAction}
            className="mt-4"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
