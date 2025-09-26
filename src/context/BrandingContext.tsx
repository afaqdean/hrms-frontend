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
    console.warn('🎨 applyBranding called with:', {
      id: brandingData.id,
      companyId: brandingData.companyId,
      primaryColor: brandingData.primaryColor,
      secondaryColor: brandingData.secondaryColor,
      backgroundColor: brandingData.backgroundColor,
      fontFamily: brandingData.fontFamily,
    });

    if (typeof window === 'undefined') {
      console.warn('🎨 Skipping applyBranding - not in browser');
      return;
    }

    const root = document.documentElement;

    // Apply color scheme
    const primaryHsl = hexToHsl(brandingData.primaryColor);
    const secondaryHsl = hexToHsl(brandingData.secondaryColor);
    const backgroundHsl = hexToHsl(brandingData.backgroundColor);

    // Use setProperty with important flag to ensure it overrides CSS
    console.warn('🎨 Setting CSS variables:', {
      primary: primaryHsl,
      secondary: secondaryHsl,
      background: backgroundHsl,
      fontFamily: brandingData.fontFamily,
    });

    root.style.setProperty('--primary', primaryHsl, 'important');
    root.style.setProperty('--secondary', secondaryHsl, 'important');
    root.style.setProperty('--background', backgroundHsl, 'important');

    // Verify the values were set
    const computedStyle = getComputedStyle(root);
    console.warn('🎨 CSS variables after setting:', {
      primary: computedStyle.getPropertyValue('--primary'),
      secondary: computedStyle.getPropertyValue('--secondary'),
      background: computedStyle.getPropertyValue('--background'),
    });

    // Apply font family
    root.style.setProperty('--font-family', `'${brandingData.fontFamily}', sans-serif`, 'important');

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

  // Load branding from localStorage on mount (only as fallback)
  useEffect(() => {
    if (typeof window !== 'undefined' && !branding && !isLoading) {
      const savedBranding = localStorage.getItem('branding');
      if (savedBranding) {
        try {
          const parsedBranding = JSON.parse(savedBranding);
          if (process.env.NODE_ENV === 'development') {
            console.warn('Loading saved branding from localStorage as fallback:', parsedBranding);
          }
          applyBranding(parsedBranding);
          setCurrentBranding(parsedBranding);
        } catch (error) {
          console.error('Error parsing saved branding:', error);
          localStorage.removeItem('branding');
        }
      }
    }
  }, [applyBranding, branding, isLoading]);

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

  // Apply branding when it changes from the database
  useEffect(() => {
    console.warn('🎨 BrandingContext effect triggered:', {
      branding: branding
        ? {
            id: branding.id,
            companyId: branding.companyId,
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
            backgroundColor: branding.backgroundColor,
            fontFamily: branding.fontFamily,
          }
        : null,
      isLoading,
      currentBranding: currentBranding
        ? {
            id: currentBranding.id,
            companyId: currentBranding.companyId,
            primaryColor: currentBranding.primaryColor,
          }
        : null,
    });

    if (branding && !isLoading) {
      // Don't apply if live preview is active
      const isLivePreview = currentBranding?.id === 'live-preview';

      if (!isLivePreview) {
        // Only apply database branding if it's not default branding
        // or if we don't have any current branding
        const isDefaultBranding = branding.id === 'default';
        const hasCurrentBranding = currentBranding && currentBranding.id !== 'default';

        if (!isDefaultBranding || !hasCurrentBranding) {
          console.warn('🎨 Applying branding from database:', {
            brandingId: branding.id,
            isDefault: isDefaultBranding,
            hasCurrent: hasCurrentBranding,
          });
          applyBranding(branding);
          setCurrentBranding(branding);
        } else {
          console.warn('🎨 Skipping default branding - custom branding already active');
        }
      } else {
        console.warn('🎨 Skipping database branding - live preview active');
      }
    } else if (!branding && !isLoading) {
      console.warn('🎨 No branding found, resetting to default');
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

  // Clear current branding (useful for clearing live preview)
  const clearCurrentBranding = useCallback(() => {
    console.warn('🎨 Clearing current branding');
    setCurrentBranding(null);
  }, []);

  const value: BrandingContextType = useMemo(() => ({
    branding: currentBranding,
    isLoading,
    error,
    applyBranding,
    resetToDefault,
    clearCurrentBranding,
  }), [currentBranding, isLoading, error, applyBranding, resetToDefault, clearCurrentBranding]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
