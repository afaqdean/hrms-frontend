import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export type LoanHistory = {
  _id: string;
  employeeId: string;
  amount: number;
  reason: string;
  status: string;
  requestedAt: string;
  installments: number;
  deductionPerMonth: number;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
};

export const useLoanHistory = () => {
  const fetchLoanHistory = async (): Promise<LoanHistory[]> => {
    const { data } = await API.get('/loan/my');
    return data;
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['loanHistory'],
    queryFn: fetchLoanHistory,
  });

  return { data, isLoading, isError, error };
};
