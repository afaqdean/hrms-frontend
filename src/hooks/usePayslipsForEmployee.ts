import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export const usePayslipsForEmployee = (employeeId?: string) => {
  const fetchPayslips = async () => {
    if (!employeeId) {
      return [];
    }

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Payslips fetch timeout after 15 seconds')), 15000);
      });

      const response = await Promise.race([
        API.get(`/payroll/payslips?employeeId=${encodeURIComponent(employeeId)}`),
        timeoutPromise,
      ]);

      return (response as any).data.payslips || [];
    } catch (error) {
      console.error('❌ Payslips API error:', error);
      throw error;
    }
  };

  const { data: payslips = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['payslips', employeeId],
    queryFn: fetchPayslips,
    enabled: !!employeeId,
    retry: 2, // Only retry twice
    retryDelay: 1000, // 1 second between retries
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent unnecessary refetches
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  return { payslips, isLoading, isError, error, refetch };
};
