'use client';

import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Define the input type for the hook
type UpdateEmployeeInput = {
  employeeId: string;
  data: Record<string, any>;
  options?: {
    showDefaultSuccessToast?: boolean;
  };
};

/**
 * Hook for updating employee data through the API
 */
export const useUpdateEmployeeAPI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, data }: UpdateEmployeeInput) => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }

      // Check if we have a file upload
      if (data.profileImage instanceof File) {
        // Handle file upload with FormData
        const formData = new FormData();

        // Add all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Handle special cases
            if (key === 'profileImage' && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object' && !(value instanceof File)) {
              // Convert objects to JSON strings
              formData.append(key, JSON.stringify(value));
            } else {
              // Convert other values to strings
              formData.append(key, String(value));
            }
          }
        });

        return API.put(`/admin/employee/${employeeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => response.data);
      }

      // Regular JSON request
      return API.put(`/admin/employee/${employeeId}`, data, {
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.data);
    },
    onSuccess: (_, variables) => {
      // Only show toast if not explicitly disabled
      if (variables.options?.showDefaultSuccessToast !== false) {
        toast.success('Employee updated successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['specificEmployee', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update employee data';
      toast.error(errorMessage);
    },
  });
};
