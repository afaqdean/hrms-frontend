import type { TenantContextType } from './tenant.types';
import { useContext } from 'react';
import { TenantContext } from './tenant.context';

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
