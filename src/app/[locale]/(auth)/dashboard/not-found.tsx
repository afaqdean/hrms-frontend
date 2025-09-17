'use client';

import Loader from '@/components/ui/Loader';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardNotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    const locale = pathname.split('/')[1] || 'en';

    if (!session) {
      router.replace(`/${locale}/sign-in`);
      return;
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Redirect based on role
    if (userRole === 'admin') {
      router.replace(`/${locale}/dashboard/admin/overview`);
    } else if (userRole === 'employee') {
      router.replace(`/${locale}/dashboard/employee/overview`);
    } else {
      router.replace(`/${locale}/sign-in`);
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
