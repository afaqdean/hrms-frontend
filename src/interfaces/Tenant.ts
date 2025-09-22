export type TenantContextType = {
  tenant: string | null;
  tenantType: 'base' | 'company' | null;
  companyId: string | null;
  isLoading: boolean;
};

export type SubdomainAvailabilityResponse = {
  available: boolean;
  message?: string;
};

export type TenantProviderProps = {
  children: React.ReactNode;
};
