import type { Deduction } from '@/interfaces/Deduction';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export const useDeductions = (employeeId: string) => {
  return useQuery({
    queryKey: ['deductions', employeeId],
    queryFn: async (): Promise<Deduction[]> => {
      if (!employeeId) {
        return [];
      }

      try {
        const response = await API.get(`/payroll/deductions/${employeeId}`);
        const { data } = response as any;

        // Use the same extraction logic as the bonus hook
        if (data && Array.isArray(data)) {
          return data; // Direct array
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data; // Wrapped in data object
        } else if (data && data.entries && Array.isArray(data.entries)) {
          return data.entries; // Wrapped in entries object
        } else if (data && data.results && Array.isArray(data.results)) {
          return data.results; // Wrapped in results object
        } else {
          console.warn('Unexpected API response structure:', data);
          return []; // Return empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching deductions:', error);
        return [];
      }
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
