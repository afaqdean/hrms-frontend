import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type ApplyLoanRequestInput = {
  amount: number;
  reason: string;
  installments: number;
};

export const useApplyLoanRequest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: ApplyLoanRequestInput) => {
      const { data } = await API.post('/loan', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loanHistory'] });
    },
  });

  return mutation;
};
