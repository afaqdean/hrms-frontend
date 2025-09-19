import RoleBasedLayout from '@/components/RoleBasedLayout';
import Header from '@/components/shared/header/Header';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure user is authenticated, redirect if not
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  // Get user role from session
  const userRole = (session.user as any)?.role?.toLowerCase();

  // Check if user has a valid role
  if (!userRole) {
    redirect('/sign-in');
  }

  return (
    <div className="flex h-screen flex-col bg-secondary-100 md:min-h-screen md:p-6 md:pb-3 md:pt-4">
      <Header />
      {/* Top navigation header */}
      <RoleBasedLayout isAdmin={(session.user as any)?.role === 'Admin'} />
      {' '}
      {/* Renders content based on user role */}
      <main className="scrollbar min-h-0 w-full flex-1 overflow-auto  md:h-3/4">
        {children}
      </main>
    </div>
  );
}
