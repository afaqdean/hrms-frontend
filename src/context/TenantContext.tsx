'use client';

import type { TenantContextType } from './tenant.types';
import React, { useEffect, useMemo, useState } from 'react';
import { TenantContext } from './tenant.context';

type TenantProviderProps = {
  children: React.ReactNode;
};

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<string | null>(null);
  const [tenantType, setTenantType] = useState<'base' | 'company' | null>(null);
  const [companyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectTenant = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const hostname = window.location.hostname;
      const hostParts = hostname.split('.');

      let detectedTenant = '';
      let detectedTenantType: 'base' | 'company' | null = null;

      if (hostParts.length >= 3) {
        // For subdomain.hr-ify.com
        detectedTenant = hostParts[0] || '';
        detectedTenantType = 'company';
      } else if (hostParts.length === 2) {
        // For hr-ify.com (base domain)
        detectedTenant = 'base';
        detectedTenantType = 'base';
      }

      // Skip tenant detection for localhost
      if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
        detectedTenant = 'base';
        detectedTenantType = 'base';
      }

      // Additional check for hr-ify.com specifically
      if (hostname === 'hr-ify.com' || hostname === 'www.hr-ify.com' || hostname.endsWith('.hr-ify.com')) {
        if (hostname === 'hr-ify.com' || hostname === 'www.hr-ify.com') {
          detectedTenant = 'base';
          detectedTenantType = 'base';
        } else {
          // Extract subdomain from hr-ify.com (excluding www)
          const subdomain = hostname.replace('.hr-ify.com', '');
          if (subdomain === 'www') {
            detectedTenant = 'base';
            detectedTenantType = 'base';
          } else {
            detectedTenant = subdomain;
            detectedTenantType = 'company';
          }
        }
      }

      setTenant(detectedTenant);
      setTenantType(detectedTenantType);
      setIsLoading(false);
    };

    detectTenant();
  }, []);

  const value: TenantContextType = useMemo(() => ({
    tenant,
    tenantType,
    companyId,
    isLoading,
  }), [tenant, tenantType, companyId, isLoading]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
