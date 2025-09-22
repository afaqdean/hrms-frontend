export type TenantContextType = {
  tenant: string | null;
  tenantType: 'base' | 'company' | null;
  companyId: string | null;
  company?: any; // Company data object
  isLoading: boolean;
  error?: string | null;
};

export type SubdomainAvailabilityResponse = {
  available: boolean;
  message?: string;
};

export type TenantProviderProps = {
  children: React.ReactNode;
};
