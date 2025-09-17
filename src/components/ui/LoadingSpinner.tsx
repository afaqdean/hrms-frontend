'use client';

import Loader from './Loader';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  color?: string;
  className?: string;
};

/**
 * A generic loading spinner component that can be used anywhere in the application
 */
export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  text,
  color = '#000000',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader
        size={size}
        color={color}
        fullScreen={fullScreen}
        withText={!!text}
        text={text}
      />
    </div>
  );
}

/**
 * A full-page loading spinner with backdrop
 */
export function PageLoadingSpinner({
  text = 'Loading...',
  color = '#000000',
}: {
  text?: string;
  color?: string;
}) {
  return (
    <Loader
      size="lg"
      color={color}
      fullScreen
      withText
      text={text}
    />
  );
}

/**
 * A button loading spinner for inline use in buttons
 */
export function ButtonSpinner({ color = '#ffffff' }: Readonly<{ color?: string }>) {
  return <Loader size="sm" color={color} />;
}
