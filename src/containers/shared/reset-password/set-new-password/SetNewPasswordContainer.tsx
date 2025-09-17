import SetNewPasswordForm from '@/components/shared/signin/reset-password/set-new-password/SetNewPasswordForm';
import SignInImage from '@/components/shared/signin/SignInImage';
import React from 'react';

const OtpVerificationContainer = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary md:bg-white">
      <div className="flex size-full flex-col justify-center bg-secondary-100 p-6 md:max-h-[75vh] md:min-h-[60vh] md:w-11/12 md:flex-row md:rounded-2xl">
        <SignInImage />
        <SetNewPasswordForm />
      </div>
    </div>
  );
};

export default OtpVerificationContainer;
