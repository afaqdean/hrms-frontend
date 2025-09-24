'use client';

import type { CompanyBranding } from '../interfaces/CompanyBranding';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useBranding } from '../hooks/useBranding';
import { hexToHsl } from '../utils/colorUtils';
import { BrandingContext, type BrandingContextType } from './BrandingContext.types';

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
    const primaryHsl = hexToHsl(brandingData.primaryColor);
    const secondaryHsl = hexToHsl(brandingData.secondaryColor);
    const backgroundHsl = hexToHsl(brandingData.backgroundColor);

    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--background', backgroundHsl);

    // Apply font family
    root.style.setProperty('--font-family', `'${brandingData.fontFamily}', sans-serif`);

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

    // Save to localStorage for persistence
    try {
      localStorage.setItem('branding', JSON.stringify(brandingData));
      if (process.env.NODE_ENV === 'development') {
        console.warn('Saved branding to localStorage:', brandingData);
      }
    } catch (error) {
      console.error('Error saving branding to localStorage:', error);
      // Show user notification about storage issue
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('branding-storage-error', {
          detail: { message: 'Unable to save branding preferences locally. Your changes will be lost on page refresh.' },
        }));
      }
    }

    setCurrentBranding(brandingData);
  }, []);

  // Load branding from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBranding = localStorage.getItem('branding');
      if (savedBranding) {
        try {
          const parsedBranding = JSON.parse(savedBranding);
          if (process.env.NODE_ENV === 'development') {
            console.warn('Loading saved branding from localStorage:', parsedBranding);
          }
          // Only apply if we don't have current branding yet (avoid race condition)
          if (!currentBranding) {
            applyBranding(parsedBranding);
            setCurrentBranding(parsedBranding);
          }
        } catch (error) {
          console.error('Error parsing saved branding:', error);
          localStorage.removeItem('branding');
        }
      }
    }
  }, [applyBranding, currentBranding]);

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
    root.style.setProperty('--font-family', '\'Poppins\', sans-serif');
    root.style.removeProperty('--logo-url');

    // Reset favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/favicon.ico';
    }

    // Clear localStorage
    try {
      localStorage.removeItem('branding');
      if (process.env.NODE_ENV === 'development') {
        console.warn('Cleared branding from localStorage');
      }
    } catch (error) {
      console.error('Error clearing branding from localStorage:', error);
    }

    setCurrentBranding(null);
  }, []);

  // Apply branding when it changes
  useEffect(() => {
    console.error('🎨 Branding context effect triggered:', { branding, isLoading, currentBranding });
    if (branding && !isLoading) {
      // Only apply if it's different from current branding to avoid unnecessary updates
      const isDifferent = !currentBranding
        || currentBranding.primaryColor !== branding.primaryColor
        || currentBranding.secondaryColor !== branding.secondaryColor
        || currentBranding.backgroundColor !== branding.backgroundColor
        || currentBranding.fontFamily !== branding.fontFamily
        || currentBranding.logoUrl !== branding.logoUrl
        || currentBranding.faviconUrl !== branding.faviconUrl;

      console.error('🎨 Is branding different?', isDifferent);
      if (isDifferent) {
        console.error('🎨 Applying updated branding:', branding);
        applyBranding(branding);
        setCurrentBranding(branding);
      }
    } else if (!branding && !isLoading && currentBranding) {
      console.error('🎨 No branding found, resetting to default');
      // Reset to default when no branding is found
      resetToDefault();
    }
  }, [branding, isLoading, applyBranding, resetToDefault, currentBranding]);

  // Debug logging for branding state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Branding state changed:', {
        branding,
        isLoading,
        error,
        currentBranding,
      });
    }
  }, [branding, isLoading, error, currentBranding]);

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
