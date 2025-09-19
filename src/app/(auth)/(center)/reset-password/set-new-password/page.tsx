import SetNewPasswordContainer from '@/containers/shared/reset-password/set-new-password/SetNewPasswordContainer';
import React, { Suspense } from 'react';

const SetNewPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetNewPasswordContainer />
    </Suspense>
  );
};

export default SetNewPasswordPage;
