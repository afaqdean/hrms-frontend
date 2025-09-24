import { useContext } from 'react';
import { BrandingContext } from './BrandingContext.types';

export const useBrandingContext = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBrandingContext must be used within a BrandingProvider');
  }
  return context;
};
