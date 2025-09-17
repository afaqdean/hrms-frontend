import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useDeleteDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deductionId: string): Promise<void> => {
      if (!deductionId) {
        throw new Error('Deduction ID is required');
      }

      await API.delete(`/payroll/deductions/${deductionId}`);

      // For DELETE requests, a successful response typically means no error was thrown
      // The API will throw an error if deletion fails, so we don't need to check response.data.success
    },
    onSuccess: () => {
      // Invalidate and refetch deductions queries
      queryClient.invalidateQueries({ queryKey: ['deductions'] });

      toast.success('Deduction deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to delete deduction';
      toast.error(errorMessage);
      console.error('Error deleting deduction:', error);
    },
  });
};
