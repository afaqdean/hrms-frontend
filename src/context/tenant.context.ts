import type { TenantContextType } from './tenant.types';
import { createContext } from 'react';

export const TenantContext = createContext<TenantContextType>({
  tenant: null,
  tenantType: null,
  companyId: null,
  isLoading: true,
});
