import { Button } from '@/components/ui/button';
import React from 'react';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error Loading Data',
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow ${className}`}>
      <div className="py-8 text-center">
        <div className="mb-4 text-4xl">❌</div>
        <h3 className="mb-2 text-lg font-semibold text-red-600">{title}</h3>
        <p className="mb-4 text-gray-600">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
