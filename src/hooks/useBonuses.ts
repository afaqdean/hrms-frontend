import type { Bonus } from '@/interfaces/Bonus';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export const useBonuses = (employeeId: string) => {
  return useQuery({
    queryKey: ['bonuses', employeeId],
    queryFn: async (): Promise<Bonus[]> => {
      if (!employeeId) {
        return [];
      }

      try {
        const response = await API.get(`/payroll/bonuses/${employeeId}`);
        const { data } = response as any;

        // Use the same extraction logic as the original hook
        if (data && Array.isArray(data)) {
          return data; // Direct array
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data; // Wrapped in data object
        } else if (data && data.entries && Array.isArray(data.entries)) {
          return data.entries; // Wrapped in entries object
        } else if (data && data.results && Array.isArray(data.results)) {
          return data.results; // Wrapped in results object
        } else {
          return []; // Return empty array as fallback
        }
      } catch (error) {
        console.error('❌ useBonuses: Error fetching bonuses:', error);
        return [];
      }
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
