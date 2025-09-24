'use client';

import type { TenantContextType, TenantProviderProps } from '@/interfaces';
import { useCompanyBySubdomain, useCompanyData } from '@/hooks/useCompanyData';
import React, { useEffect, useMemo, useState } from 'react';
import { TenantContext } from './tenant.context';

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<string | null>(null);
  const [tenantType, setTenantType] = useState<'base' | 'company' | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Only use React Query hooks on the client side
  const { company: companyById, isLoading: companyByIdLoading } = useCompanyData(
    isClient && companyId && companyId !== 'pending' ? companyId : undefined,
  );

  // Use subdomain-based company fetching when companyId is 'pending'
  const { company: companyBySubdomain, isLoading: companyBySubdomainLoading } = useCompanyBySubdomain(
    isClient && companyId === 'pending' && tenant ? tenant : undefined,
  );

  // Use the appropriate company data
  const company = companyById || companyBySubdomain;
  const companyLoading = companyByIdLoading || companyBySubdomainLoading;

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const detectTenant = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const hostname = window.location.hostname;
        const hostParts = hostname.split('.');

        let detectedTenant = '';
        let detectedTenantType: 'base' | 'company' | null = null;
        let detectedCompanyId: string | null = null;

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

              // For company tenants, we need to fetch the company ID
              // This would typically be done via an API call to validate the subdomain
              // For now, we'll set a placeholder that will be resolved by the company data hook
              detectedCompanyId = 'pending'; // This will trigger the company data fetch
            }
          }
        }

        setTenant(detectedTenant);
        setTenantType(detectedTenantType);
        setCompanyId(detectedCompanyId);
        setError(null);
      } catch (err) {
        console.error('Error detecting tenant:', err);
        setError('Failed to detect tenant');
        setTenant('base');
        setTenantType('base');
        setCompanyId(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectTenant();
  }, []);

  // Update companyId when company data is loaded
  useEffect(() => {
    if (company && company.id && companyId === 'pending') {
      setCompanyId(company.id);
    }
  }, [company, companyId]);

  const value: TenantContextType = useMemo(() => ({
    tenant,
    tenantType,
    companyId: companyId === 'pending' ? null : companyId,
    company,
    isLoading: isLoading || (isClient && companyLoading),
    error,
  }), [tenant, tenantType, companyId, company, isLoading, isClient, companyLoading, error]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
