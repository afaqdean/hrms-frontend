'use client';

import { updateEmployeeBaseSalary } from '@/services/salaryIncrementService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type UpdateSalaryParams = {
  employeeId: string;
  salary: number;
};

const useUpdateEmployeeSalary = () => {
  const queryClient = useQueryClient();

  const updateSalary = async ({ employeeId, salary }: UpdateSalaryParams) => {
    try {
      const response = await updateEmployeeBaseSalary(employeeId, salary);
      return response;
    } catch (error) {
      console.error('Failed to update employee salary:', error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: updateSalary,
    onSuccess: () => {
      // Invalidate and refetch employees data
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      toast.success('Employee salary updated successfully');
    },
    onError: (error) => {
      console.error('Error updating employee salary:', error);
      toast.error('Failed to update employee salary. Please try again.');
    },
  });

  return {
    updateSalary: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};

export default useUpdateEmployeeSalary;
