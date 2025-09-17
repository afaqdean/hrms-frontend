'use client';

import React from 'react';
import Loader from './Loader';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  color?: string;
};

export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  text = 'Loading...',
  color = '#000000',
}: LoadingSpinnerProps) {
  return (
    <Loader
      size={size}
      fullScreen={fullScreen}
      withText={!!text}
      text={text}
      color={color}
    />
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex size-full min-h-[50vh] items-center justify-center">
      <Loader size="lg" withText text="Loading ..." color="#000000" />
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return <Loader size="sm" color="#ffffff" />;
}
