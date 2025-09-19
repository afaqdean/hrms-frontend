'use client';

const getTenantHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {
      'x-tenant': 'base',
      'x-tenant-type': 'base',
    };
  }

  const hostname = window.location.hostname;
  const hostParts = hostname.split('.');

  let tenant = '';
  let tenantType = 'base';

  if (hostParts.length >= 3) {
    // For subdomain.hr-ify.com
    tenant = hostParts[0] || '';
    tenantType = 'company';
  } else if (hostParts.length === 2) {
    // For hr-ify.com (base domain)
    tenant = 'base';
    tenantType = 'base';
  }

  // Skip tenant detection for localhost
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    tenant = 'base';
    tenantType = 'base';
  }

  return {
    'x-tenant': tenant,
    'x-tenant-type': tenantType,
  };
};

export const tenantApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  const tenantHeaders = getTenantHeaders();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...tenantHeaders,
      ...(options.headers as Record<string, string>),
    },
  });

  return response;
};

export const getTenantInfo = () => {
  if (typeof window === 'undefined') {
    return { tenant: null, tenantType: null };
  }

  const hostname = window.location.hostname;
  const hostParts = hostname.split('.');

  let tenant = '';
  let tenantType: 'base' | 'company' | null = null;

  if (hostParts.length >= 3) {
    // For subdomain.hr-ify.com
    tenant = hostParts[0] || '';
    tenantType = 'company';
  } else if (hostParts.length === 2) {
    // For hr-ify.com (base domain)
    tenant = 'base';
    tenantType = 'base';
  }

  // Skip tenant detection for localhost
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    tenant = 'base';
    tenantType = 'base';
  }

  return { tenant, tenantType };
};
