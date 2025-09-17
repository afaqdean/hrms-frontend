import type { CreateSalaryIncrementPayload, SalaryIncrement, UpdateSalaryIncrementPayload } from '@/interfaces/SalaryIncrement';
import {
  createSalaryIncrement as createSalaryIncrementService,
  deleteSalaryIncrement as deleteSalaryIncrementService,
  extractArrayFromResponse,
  getEmployeeSalaryChangeLog,
  getEmployeeSalaryIncrements,
  updateSalaryIncrement as updateSalaryIncrementService,
} from '@/services/salaryIncrementService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useSalaryIncrement = () => {
  const queryClient = useQueryClient();

  const createSalaryIncrement = async ({ employeeId, payload }: { employeeId: string; payload: CreateSalaryIncrementPayload }) => {
    return createSalaryIncrementService(employeeId, payload);
  };

  const updateSalaryIncrement = async ({
    employeeId: _employeeId,
    incrementId,
    payload,
  }: {
    employeeId: string;
    incrementId: string;
    payload: UpdateSalaryIncrementPayload;
  }) => {
    return updateSalaryIncrementService(incrementId, payload);
  };

  const deleteSalaryIncrement = async ({ employeeId: _employeeId, incrementId }: { employeeId: string; incrementId: string }) => {
    return deleteSalaryIncrementService(incrementId);
  };

  const createMutation = useMutation({
    mutationFn: createSalaryIncrement,
    onSuccess: (_, variables) => {
      // Invalidate and refetch employee data
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['salaryIncrements', variables.employeeId] });

      toast.success('Salary increment created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create salary increment';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSalaryIncrement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['salaryIncrements', variables.employeeId] });
      toast.success('Salary increment updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update salary increment';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSalaryIncrement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['salaryIncrements', variables.employeeId] });
      toast.success('Salary increment deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete salary increment';
      toast.error(errorMessage);
    },
  });

  return {
    createSalaryIncrement: createMutation.mutate,
    createSalaryIncrementAsync: createMutation.mutateAsync,
    updateSalaryIncrement: updateMutation.mutate,
    updateSalaryIncrementAsync: updateMutation.mutateAsync,
    deleteSalaryIncrement: deleteMutation.mutate,
    deleteSalaryIncrementAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};

// Hook to fetch salary increments for an employee
export const useSalaryIncrements = (employeeId: string) => {
  return useQuery({
    queryKey: ['salaryIncrements', employeeId],
    queryFn: async (): Promise<SalaryIncrement[]> => {
      const response = await getEmployeeSalaryIncrements(employeeId);
      // Handle different response structures
      return extractArrayFromResponse(response);
    },
    enabled: !!employeeId,
  });
};

export const useSalaryChangeLog = (employeeId: string) => {
  return useQuery({
    queryKey: ['salaryChangeLog', employeeId],
    queryFn: async () => {
      const response = await getEmployeeSalaryChangeLog(employeeId);
      // Handle different response structures
      return extractArrayFromResponse(response);
    },
    enabled: !!employeeId,
  });
};
