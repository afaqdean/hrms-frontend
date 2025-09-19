import type { Employee } from '@/interfaces/Employee';
import type { LoanRequest, UpdateLoanRequestInput } from '@/interfaces/LoanRequest';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Fetch all loan requests for admin
export const useAdminLoanRequests = () => {
  const fetchLoanRequests = async (): Promise<LoanRequest[]> => {
    try {
      // Fetch loans
      const { data: loanData } = await API.get('/loan');
      const loans = loanData?.loanRequests || loanData?.loans || loanData || [];

      // Fetch employees to populate employee details (as fallback)
      const { data: employeeData } = await API.get('/user/users');

      const employees = employeeData || [];

      // Create a map of employee data for quick lookup
      const employeeMap = new Map<string, Employee>();
      employees.forEach((emp: Employee) => {
        employeeMap.set(emp._id, emp);
      });

      // Populate loan requests with employee details
      const populatedLoans = loans.map((loan: LoanRequest) => {
        // Check if employeeId is an object (populated employee data)
        if (typeof loan.employeeId === 'object' && loan.employeeId !== null) {
          const employeeObj = loan.employeeId as { name?: string; employeeName?: string; email?: string; profileImage?: string };
          return {
            ...loan,
            employeeName: employeeObj.name || employeeObj.employeeName || 'Unknown Employee',
            employeeEmail: employeeObj.email || 'No email available',
            employeeProfileImage: employeeObj.profileImage || '/assets/avatar.jpg',
          };
        }

        // If employeeId is a string, look it up in the employee map
        const employee = employeeMap.get(loan.employeeId as string);
        return {
          ...loan,
          employeeName: employee?.name || `Employee ${loan.employeeId}`,
          employeeEmail: employee?.email || 'No email available',
          employeeProfileImage: employee?.profileImage || '/assets/avatar.jpg',
        };
      });

      return populatedLoans;
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      return [];
    }
  };

  const { data: loanRequests = [], isLoading, isError, error } = useQuery({
    queryKey: ['adminLoanRequests'],
    queryFn: fetchLoanRequests,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return { loanRequests, isLoading, isError, error };
};

// Update loan request status
export const useUpdateLoanRequest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ loanId, updateData }: { loanId: string; updateData: UpdateLoanRequestInput }) => {
      const { data } = await API.patch(`/loan/${loanId}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminLoanRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminPayrollOverview'] });

      const statusText = variables.updateData.status.toLowerCase();
      toast.success(`Loan request ${statusText} successfully!`);
    },
    onError: (error: unknown) => {
      const errorMessage = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          return String(error.response.data.message);
        }
        return 'Failed to update loan request';
      })();
      toast.error(errorMessage);
    },
  });

  return mutation;
};

// Delete loan request
export const useDeleteLoanRequest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (loanId: string) => {
      const { data } = await API.delete(`/loan/${loanId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLoanRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminPayrollOverview'] });
      toast.success('Loan deleted successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          return String(error.response.data.message);
        }
        return 'Failed to delete loan request';
      })();
      toast.error(errorMessage);
    },
  });

  return mutation;
};
