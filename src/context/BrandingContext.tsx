'use client';

import type { CompanyBranding } from '../interfaces/CompanyBranding';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useBranding } from '../hooks/useBranding';
import { hexToHsl } from '../utils/colorUtils';

type BrandingContextType = {
  branding: CompanyBranding | null;
  isLoading: boolean;
  error: any;
  applyBranding: (branding: CompanyBranding) => void;
  resetToDefault: () => void;
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBrandingContext = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBrandingContext must be used within a BrandingProvider');
  }
  return context;
};

type BrandingProviderProps = {
  children: React.ReactNode;
};

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const { branding, isLoading, error } = useBranding();
  const [currentBranding, setCurrentBranding] = useState<CompanyBranding | null>(null);

  // Apply branding to CSS variables
  const applyBranding = useCallback((brandingData: CompanyBranding) => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;

    // Apply color scheme
    root.style.setProperty('--primary', hexToHsl(brandingData.primaryColor));
    root.style.setProperty('--secondary', hexToHsl(brandingData.secondaryColor));
    root.style.setProperty('--background', hexToHsl(brandingData.backgroundColor));

    // Apply font family
    root.style.setProperty('--font-family', brandingData.fontFamily);

    // Apply logo if available
    if (brandingData.logoUrl) {
      root.style.setProperty('--logo-url', `url(${brandingData.logoUrl})`);
    }

    // Apply favicon if available
    if (brandingData.faviconUrl) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = brandingData.faviconUrl;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = brandingData.faviconUrl;
        document.head.appendChild(newFavicon);
      }
    }

    setCurrentBranding(brandingData);
  }, []);

  // Reset to default branding
  const resetToDefault = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;

    // Reset to default values
    root.style.setProperty('--primary', '0 0% 9%');
    root.style.setProperty('--secondary', '0 0% 96.1%');
    root.style.setProperty('--background', '0 0% 100%');
    root.style.setProperty('--font-family', 'Poppins');
    root.style.removeProperty('--logo-url');

    // Reset favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/favicon.ico';
    }

    setCurrentBranding(null);
  }, []);

  // Apply branding when it changes
  useEffect(() => {
    if (branding && !isLoading) {
      applyBranding(branding);
    }
  }, [branding, isLoading, applyBranding]);

  const value: BrandingContextType = useMemo(() => ({
    branding: currentBranding,
    isLoading,
    error,
    applyBranding,
    resetToDefault,
  }), [currentBranding, isLoading, error, applyBranding, resetToDefault]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
