import type { CreateBonusPayload } from '@/interfaces/Bonus';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCreateBonus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bonusData: CreateBonusPayload): Promise<any> => {
      if (!bonusData.employeeId || !bonusData.amount || !bonusData.period || !bonusData.reason) {
        throw new Error('Missing required bonus information');
      }

      const response = await API.post('/payroll/bonuses', bonusData);

      // Check if response has data and contains bonus fields (indicating success)
      if (!response.data || !response.data._id) {
        throw new Error(response.data?.message || 'Failed to create bonus');
      }

      return response.data;
    },
    onSuccess: (_, bonusData) => {
      // Invalidate and refetch bonuses queries for the specific employee
      queryClient.invalidateQueries({ queryKey: ['bonuses', bonusData.employeeId] });

      toast.success('Bonus created successfully');
      // console.log('Bonus created:', data);
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to create bonus';
      toast.error(errorMessage);
      console.error('Error creating bonus:', error);
    },
  });
};
