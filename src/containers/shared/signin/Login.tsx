import SignInForm from '@/components/shared/signin/SignInForm';
import SignInImage from '@/components/shared/signin/SignInImage';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Login = () => {
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simple authentication check
    if (status === 'loading') {
      // Still checking auth status, show loading
      setIsLoading(true);
      return;
    }

    if (status === 'authenticated' && !isRedirecting) {
      // User is authenticated, redirect based on role
      const userRole = (session?.user as any)?.role?.toLowerCase();
      setIsRedirecting(true);

      // Use setTimeout to avoid Next.js router conflicts
      setTimeout(() => {
        if (userRole === 'admin') {
          router.push('/dashboard/admin/overview');
        } else {
          router.push('/dashboard/employee/overview');
        }
      }, 100);
    } else if (status === 'unauthenticated') {
      // User is not authenticated, show login form
      setIsLoading(false);
    }
  }, [status, session, router, isRedirecting]);

  if (isLoading && status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Redirecting to dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary md:bg-white">
      <div className=" flex size-full flex-col justify-center bg-secondary-100 p-6 md:max-h-[94vh] md:min-h-[80vh] md:w-11/12 md:flex-row md:rounded-2xl">
        <SignInImage />
        <SignInForm />
      </div>
    </div>
  );
};

export default Login;
