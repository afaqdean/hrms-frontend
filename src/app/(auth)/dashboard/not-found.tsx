'use client';

import Loader from '@/components/ui/Loader';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function DashboardNotFoundContent() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      router.replace('/sign-in');
      return;
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Redirect based on role
    if (userRole === 'admin') {
      router.replace('/dashboard/admin/overview');
    } else if (userRole === 'employee') {
      router.replace('/dashboard/employee/overview');
    } else {
      router.replace('/sign-in');
    }
  }, [session, status, router, pathname]);

  return (
    <div className="flex size-full min-h-screen items-center justify-center">
      <Loader
        size="lg"
        color="#000000"
        withText
        text="Redirecting to your dashboard..."
      />
    </div>
  );
}

const DashboardNotFound = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex size-full min-h-screen items-center justify-center">
        <Loader
          size="lg"
          color="#000000"
          withText
          text="Loading..."
        />
      </div>
    );
  }

  return <DashboardNotFoundContent />;
};

export default DashboardNotFound;
