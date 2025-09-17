'use client';

import LoadingState from '@/components/ui/LoadingState';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import React from 'react';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, hasError, errorMessage, isAuthenticated, employeeId } = useAuthGuard();

  // Show loading state while auth is initializing
  if (isLoading) {
    return <LoadingState message="Loading authentication..." fullScreen />;
  }

  // Show error if authentication failed
  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Extra safety check: only render children if we have both authentication and employeeId
  if (!isAuthenticated || !employeeId) {
    return <LoadingState message="Verifying authentication..." fullScreen />;
  }

  // Render children if authentication is successful
  return <>{children}</>;
};

export default AuthGuard;
