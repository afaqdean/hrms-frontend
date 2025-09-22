'use client';

import type { SubdomainAvailabilityResponse } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';

export const useSubdomainAvailability = (subdomain: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['subdomain-availability', subdomain],
    queryFn: async (): Promise<SubdomainAvailabilityResponse> => {
      if (!subdomain) {
        return { available: false, message: 'Subdomain is required' };
      }

      const response = await fetch(`/api/company/subdomain/${subdomain}`);

      if (!response.ok) {
        throw new Error('Failed to check subdomain availability');
      }

      return response.json();
    },
    enabled: !!subdomain && subdomain.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    isAvailable: data?.available ?? false,
    message: data?.message,
    isLoading,
    error: error?.message,
    refetch,
  };
};
