'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Slowly increase to 90% while waiting for the page to load
          if (prevProgress >= 90) {
            return 90;
          }
          return prevProgress + (90 - prevProgress) * 0.1;
        });
      }, 100);
    };

    const completeLoading = () => {
      clearInterval(interval);
      setProgress(100);

      // Reset after animation completes
      timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    };

    // Start loading
    startLoading();

    // Complete loading when route changes
    completeLoading();

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 bg-primary transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  );
}
