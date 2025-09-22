'use client';

import type { Company, CompanyUpdateData } from '@/interfaces';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCompanyData = (companyId?: string) => {
  const queryClient = useQueryClient();

  // Get company data
  const { data: company, isLoading, error, refetch } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async (): Promise<Company> => {
      const response = await API.get(`/company/${companyId}`);
      return response.data;
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async ({ companyId, data }: { companyId: string; data: CompanyUpdateData }): Promise<Company> => {
      const response = await API.patch(`/company/${companyId}`, data);
      return response.data;
    },
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData(['company', updatedCompany.id], updatedCompany);
      toast.success('Company updated successfully');
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to update company');
    },
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string): Promise<void> => {
      await API.delete(`/company/${companyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to delete company');
    },
  });

  return {
    company,
    isLoading,
    error: error?.message,
    refetch,
    updateCompany: updateCompanyMutation.mutate,
    updateCompanyAsync: updateCompanyMutation.mutateAsync,
    isUpdating: updateCompanyMutation.isPending,
    deleteCompany: deleteCompanyMutation.mutate,
    deleteCompanyAsync: deleteCompanyMutation.mutateAsync,
    isDeleting: deleteCompanyMutation.isPending,
  };
};

// Hook for getting all companies (admin only)
export const useCompanies = () => {
  const { data: companies, isLoading, error, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const response = await API.get('/company');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    companies: companies || [],
    isLoading,
    error: error?.message,
    refetch,
  };
};
