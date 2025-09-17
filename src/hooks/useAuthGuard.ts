import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

type AuthGuardResult = {
  isLoading: boolean;
  isAuthenticated: boolean;
  employeeId: string;
  hasError: boolean;
  errorMessage: string;
};

export const useAuthGuard = (): AuthGuardResult => {
  const { userData, isAuthenticated } = useAuth();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const employeeId = userData?.employeeID || '';

  // Add a small delay to ensure hydration is complete
  useEffect(() => {
    // Add a small delay to ensure the authentication state is stable
    const timer = setTimeout(() => {
      setHasInitialized(true);
      setIsLoading(false);
    }, 100); // 100ms delay to allow for hydration

    return () => clearTimeout(timer);
  }, []);

  // Determine if there's an error and what message to show
  let hasError = false;
  let errorMessage = '';

  // Only show errors after auth has finished loading AND initialization is complete
  if (!isLoading && hasInitialized) {
    if (!isAuthenticated) {
      hasError = true;
      errorMessage = 'You are not authenticated. Please sign in again.';
    } else if (isAuthenticated && !employeeId) {
      hasError = true;
      errorMessage = 'Employee ID not found. Please contact your administrator.';
    }
  }

  return {
    isLoading: isLoading || !hasInitialized,
    isAuthenticated,
    employeeId,
    hasError,
    errorMessage,
  };
};
