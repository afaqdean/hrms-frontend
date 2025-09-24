import type { CreateCompanyBrandingDto, UpdateCompanyBrandingDto } from '../interfaces/CompanyBranding';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTenant } from '../context/useTenant';
import { brandingApi } from '../services/brandingApi';

export const useBranding = () => {
  const { tenant, tenantType } = useTenant();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Get branding based on tenant type
  const {
    data: brandingData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branding', tenant, tenantType],
    queryFn: async () => {
      if (tenantType === 'company' && tenant) {
        return await brandingApi.getBrandingBySubdomain(tenant);
      } else {
        return await brandingApi.getDefaultBranding();
      }
    },
    enabled: (!!tenant || tenantType === 'base') && !!session && !!session.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create branding mutation
  const createBrandingMutation = useMutation({
    mutationFn: (createBrandingDto: CreateCompanyBrandingDto) =>
      brandingApi.createBranding(createBrandingDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', tenant, tenantType] });
    },
  });

  // Update branding mutation
  const updateBrandingMutation = useMutation({
    mutationFn: ({ companyId, updateData }: { companyId: string; updateData: UpdateCompanyBrandingDto }) =>
      brandingApi.updateBranding(companyId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', tenant, tenantType] });
    },
  });

  // Delete branding mutation
  const deleteBrandingMutation = useMutation({
    mutationFn: (companyId: string) => brandingApi.deleteBranding(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', tenant, tenantType] });
    },
  });

  return {
    branding: brandingData?.branding,
    isLoading,
    error,
    refetch,
    createBranding: createBrandingMutation.mutate,
    updateBranding: updateBrandingMutation.mutate,
    deleteBranding: deleteBrandingMutation.mutate,
    isCreating: createBrandingMutation.isPending,
    isUpdating: updateBrandingMutation.isPending,
    isDeleting: deleteBrandingMutation.isPending,
  };
};

export const useBrandingByCompanyId = (companyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: brandingData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branding', companyId],
    queryFn: () => brandingApi.getBrandingByCompanyId(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update branding mutation
  const updateBrandingMutation = useMutation({
    mutationFn: (updateData: UpdateCompanyBrandingDto) =>
      brandingApi.updateBranding(companyId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding', companyId] });
    },
  });

  return {
    branding: brandingData?.branding,
    isLoading,
    error,
    refetch,
    updateBranding: updateBrandingMutation.mutate,
    isUpdating: updateBrandingMutation.isPending,
  };
};
