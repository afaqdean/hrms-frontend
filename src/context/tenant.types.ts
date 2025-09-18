export type TenantContextType = {
  tenant: string | null;
  tenantType: 'base' | 'company' | null;
  companyId: string | null;
  isLoading: boolean;
};
