'use client';

import ErrorAlert from '@/components/ui/alerts/ErrorAlert';
import LoadingAlert from '@/components/ui/alerts/LoadingAlert';
import { useUserCnic } from '@/hooks/useUserCnic';
import React, { useEffect, useState } from 'react';

const CnicStatusAlert: React.FC = () => {
  const { cnic: employeeCnic, loading: cnicLoading, error: cnicError, refetch: refetchCnic } = useUserCnic();
  const [cnicTimeout, setCnicTimeout] = useState(false);

  // Set a timeout for CNIC loading to prevent eternal loading
  useEffect(() => {
    if (cnicLoading) {
      const timeout = setTimeout(() => {
        setCnicTimeout(true);
      }, 15000); // 15 seconds timeout

      return () => clearTimeout(timeout);
    } else {
      setCnicTimeout(false);
      return undefined;
    }
  }, [cnicLoading]);

  const isCnicAvailable = !!employeeCnic;

  // Show loading alert while CNIC is loading
  if (cnicLoading) {
    return (
      <LoadingAlert
        title="Loading CNIC..."
        message="Fetching your CNIC information for payslip downloads."
        showTimeout={cnicTimeout}
        timeoutMessage="Loading is taking longer than expected. You can try refreshing or continue without CNIC."
        onRefresh={() => window.location.reload()}
        onContinue={cnicTimeout ? () => setCnicTimeout(false) : undefined}
      />
    );
  }

  // Show error alert if CNIC is not available
  if (!cnicLoading && !isCnicAvailable) {
    return (
      <ErrorAlert
        title="CNIC Not Available"
        message="Your CNIC (Computerized National Identity Card) number is required to download payslips. Payslip information will still be displayed, but downloads will not work."
        errorDetails={cnicError || undefined}
        additionalMessage="Please contact your administrator to add your CNIC to your profile."
        onRefresh={() => window.location.reload()}
        onRetry={refetchCnic}
      />
    );
  }

  // Don't render anything if CNIC is available
  return null;
};

export default CnicStatusAlert;
