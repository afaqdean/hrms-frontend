'use client';

import React from 'react';
import Loader from './Loader';

type LoadingIndicatorProps = {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
  color?: string;
};

/**
 * A utility component for displaying loading indicators throughout the application
 * Can be used as a drop-in replacement for loading text or spinners
 */
export default function LoadingIndicator({
  text = 'Loading...',
  size = 'md',
  className = '',
  fullPage = false,
  color = '#000000',
}: LoadingIndicatorProps) {
  if (fullPage) {
    return (
      <div className={`flex min-h-[50vh] w-full items-center justify-center ${className}`}>
        <Loader
          size={size}
          withText={!!text}
          text={text}
          color={color}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader
        size={size}
        withText={!!text}
        text={text}
        color={color}
      />
    </div>
  );
}

/**
 * A specialized version for table/list loading states
 */
export function TableLoadingIndicator({ text = 'Loading data...', className = '' }: { text?: string; className?: string }) {
  return (
    <div className={`flex w-full items-center justify-center p-6 ${className}`}>
      <Loader size="md" withText text={text} />
    </div>
  );
}

/**
 * A specialized version for section loading states
 */
export function SectionLoadingIndicator({ text = 'Loading...', className = '' }: { text?: string; className?: string }) {
  return (
    <div className={`flex min-h-[200px] w-full items-center justify-center ${className}`}>
      <Loader size="md" withText text={text} />
    </div>
  );
}

/**
 * A specialized version for card loading states
 */
export function CardLoadingIndicator({ text = 'Loading...', className = '' }: { text?: string; className?: string }) {
  return (
    <div className={`flex size-full items-center justify-center rounded-lg bg-white p-4 shadow-sm ${className}`}>
      <Loader size="sm" withText text={text} />
    </div>
  );
}
