'use client';

import type { CompanyRegistrationData, CompanyRegistrationResponse } from '@/interfaces';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCompanyRegistration = () => {
  const mutation = useMutation({
    mutationFn: async (data: CompanyRegistrationData): Promise<CompanyRegistrationResponse> => {
      const response = await fetch('/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register company');
      }

      return result;
    },
    onSuccess: (_data, variables) => {
      toast.success('Company registered successfully!');
      // Redirect to the new company subdomain
      window.location.href = `https://${variables.subdomain}.hr-ify.com/sign-in`;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register company');
    },
  });

  return {
    registerCompany: mutation.mutate,
    registerCompanyAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
  };
};
