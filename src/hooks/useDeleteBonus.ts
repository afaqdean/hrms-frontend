import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useDeleteBonus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bonusId: string): Promise<void> => {
      if (!bonusId) {
        throw new Error('Bonus ID is required');
      }

      await API.delete(`/payroll/bonuses/${bonusId}`);

      // For DELETE requests, a successful response typically means no error was thrown
      // The API will throw an error if deletion fails, so we don't need to check response.data.success
    },
    onSuccess: () => {
      // Invalidate and refetch bonuses queries
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });

      toast.success('Bonus deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to delete bonus';
      toast.error(errorMessage);
      console.error('Error deleting bonus:', error);
    },
  });
};
