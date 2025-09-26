import type { CreateCompanyBrandingDto, UpdateCompanyBrandingDto } from '../interfaces/CompanyBranding';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/useTenant';
import { brandingApi } from '../services/brandingApi';

export const useBranding = () => {
  const { tenant, tenantType } = useTenant();
  const { isAuthenticated, userData } = useAuth();
  const queryClient = useQueryClient();

  // Get branding based on tenant type
  const {
    data: brandingData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branding', tenant, tenantType, userData?.id],
    queryFn: async () => {
      if (tenantType === 'company' && tenant) {
        const result = await brandingApi.getBrandingBySubdomain(tenant);
        return result;
      } else {
        // For base domain, try to get user-specific branding first
        if (userData?.id) {
          try {
            return await brandingApi.getBrandingByCompanyId(userData.id);
          } catch {
            // Fall back to default branding
          }
        }

        // Fall back to default branding
        return await brandingApi.getDefaultBranding();
      }
    },
    enabled: (!!tenant || tenantType === 'base') && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Create branding mutation
  const createBrandingMutation = useMutation({
    mutationFn: (createBrandingDto: CreateCompanyBrandingDto) =>
      brandingApi.createBranding(createBrandingDto),
    onSuccess: () => {
      // Don't invalidate immediately to prevent revert
      // The branding context will handle the update
    },
    onError: (error) => {
      console.error('Create branding mutation error:', error);
    },
  });

  // Update branding mutation
  const updateBrandingMutation = useMutation({
    mutationFn: ({ companyId, updateData }: { companyId: string; updateData: UpdateCompanyBrandingDto }) =>
      brandingApi.updateBranding(companyId, updateData),
    onSuccess: () => {
      // Don't invalidate immediately to prevent revert
      // The branding context will handle the update
    },
    onError: (error) => {
      console.error('Update branding mutation error:', error);
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
    createBrandingMutation,
    updateBrandingMutation,
    deleteBrandingMutation,
    isCreating: createBrandingMutation.isPending,
    isUpdating: updateBrandingMutation.isPending,
    isDeleting: deleteBrandingMutation.isPending,
  };
};

export const useBrandingByCompanyId = (companyId: string) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: brandingData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branding', companyId],
    queryFn: () => brandingApi.getBrandingByCompanyId(companyId),
    enabled: !!companyId && isAuthenticated,
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
