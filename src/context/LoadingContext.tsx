/* eslint-disable react/no-unstable-context-value */
'use client';

import Loader from '@/components/ui/Loader';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { usePathname, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { LoadingContext } from './LoadingContextTypes';

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;

    const handleStart = (event: BeforeUnloadEvent) => {
      // Check if this is likely a file download by examining the event
      // File downloads don't usually have a returnValue set
      const isLikelyFileDownload = !event.returnValue && !event.defaultPrevented;

      if (!isLikelyFileDownload) {
        setIsLoading(true);

        // Set a timeout to reset loading state in case 'load' event doesn't fire
        loadingTimeout = setTimeout(() => {
          setIsLoading(false);
        }, 5000); // Reset after 5 seconds if no load event
      }
    };

    const handleComplete = () => {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    };

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      clearTimeout(loadingTimeout);
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      <NavigationProgress />
      {isLoading && <Loader size="lg" fullScreen withText text="Loading..." />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
