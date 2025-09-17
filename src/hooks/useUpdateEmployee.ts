'use client';

import type { Employee } from '@/interfaces/Employee';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type UpdateEmployeeParams = {
  employeeId: string;
  data: Partial<Employee>;
};

const updateEmployee = async ({ employeeId, data }: UpdateEmployeeParams): Promise<Employee> => {
  const response = await API.put(`/admin/employee/${employeeId}`, data);
  return response.data;
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (_, variables) => {
      // Invalidate and refetch the employee data
      queryClient.invalidateQueries({ queryKey: ['specificEmployee', variables.employeeId] });

      // Also invalidate the entire employees list
      queryClient.invalidateQueries({ queryKey: ['employees'] });

      toast.success('Employee updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      toast.error(errorMessage);
    },
  });
};
