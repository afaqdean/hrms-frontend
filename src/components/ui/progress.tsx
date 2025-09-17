'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type ProgressProps = {
  value: number;
  className?: string;
};

const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}>
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export { Progress };
