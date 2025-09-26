import type { CompanyBranding } from '../interfaces/CompanyBranding';
import { createContext } from 'react';

export type BrandingContextType = {
  branding: CompanyBranding | null;
  isLoading: boolean;
  error: any;
  applyBranding: (branding: CompanyBranding) => void;
  resetToDefault: () => void;
  clearCurrentBranding: () => void;
};

export const BrandingContext = createContext<BrandingContextType | undefined>(undefined);
