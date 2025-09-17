'use client';

import { getCnicWithFallback } from '@/utils/cnicUtils';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

export const useUserCnic = () => {
  const retryCountRef = useRef(0);

  const fetchCnic = useCallback(async () => {
    console.warn('Fetching CNIC with fallback strategy... (attempt', retryCountRef.current + 1, ')');

    try {
      // Use the utility function that handles multiple fallback strategies
      const cnicValue = await getCnicWithFallback();

      if (cnicValue) {
        console.warn('CNIC successfully retrieved:', cnicValue);
        retryCountRef.current = 0; // Reset retry count on success
        return cnicValue;
      } else {
        throw new Error('CNIC not found from any source');
      }
    } catch (err: any) {
      console.error('CNIC fetch error:', err);
      const errorMessage = err.message || 'Failed to fetch CNIC';

      // Increment retry count
      retryCountRef.current += 1;

      // If we've retried too many times, stop trying
      if (retryCountRef.current >= 2) {
        console.error('CNIC fetch failed after 3 attempts, giving up');
        throw new Error('Failed to fetch CNIC after multiple attempts. Please refresh the page.');
      }

      throw new Error(errorMessage);
    }
  }, []);

  const { data: cnic, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['userCnic'],
    queryFn: fetchCnic,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const reset = () => {
    console.warn('Resetting CNIC hook state...');
    retryCountRef.current = 0;
    // React Query will handle the reset automatically
  };

  return {
    cnic: cnic || null,
    loading,
    error: error?.message || null,
    refetch,
    reset,
  };
};
