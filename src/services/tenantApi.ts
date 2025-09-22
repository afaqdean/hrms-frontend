'use client';

import { API } from '@/Interceptors/Interceptor';

// Legacy function for backward compatibility - now uses API instance
type AxiosConfig = {
  method: string;
  url: string;
  data?: BodyInit;
  headers?: Record<string, string>;
};

type ApiError = {
  response?: {
    status?: number;
  };
  message: string;
};

export const tenantApiCall = async (endpoint: string, options: RequestInit = {}) => {
  // Convert fetch options to axios config
  const axiosConfig: AxiosConfig = {
    method: options.method || 'GET',
    url: endpoint,
  };

  if (options.body) {
    axiosConfig.data = options.body;
  }

  if (options.headers) {
    axiosConfig.headers = options.headers as Record<string, string>;
  }

  try {
    const response = await API(axiosConfig);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
    };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return {
      ok: false,
      status: apiError.response?.status || 500,
      json: async () => ({ error: apiError.message }),
      text: async () => apiError.message,
    };
  }
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
