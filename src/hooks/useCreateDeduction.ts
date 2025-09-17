import type { CreateDeductionPayload } from '@/interfaces/Deduction';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCreateDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDeductionPayload): Promise<void> => {
      const response = await API.post('/payroll/deductions', payload);

      // Check if response has data and contains deduction fields (indicating success)
      if (!response.data || !response.data._id) {
        throw new Error(response.data?.message || 'Failed to create deduction');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch deductions queries
      queryClient.invalidateQueries({ queryKey: ['deductions'] });

      toast.success('Deduction created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create deduction';
      toast.error(errorMessage);
      console.error('Error creating deduction:', error);
    },
  });
};
