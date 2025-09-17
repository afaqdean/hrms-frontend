import ResetPasswordForm from '@/components/shared/signin/reset-password/ResetPasswordForm';
import SignInImage from '@/components/shared/signin/SignInImage';
import React from 'react';

const ResetPasswordContainer = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary md:bg-white">
      <div className=" flex size-full flex-col justify-center bg-secondary-100 p-6 md:max-h-[75vh] md:min-h-[60vh] md:w-11/12 md:flex-row md:rounded-2xl">
        <SignInImage />
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordContainer;
