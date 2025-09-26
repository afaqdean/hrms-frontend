import RoleBasedLayout from '@/components/RoleBasedLayout';
import Header from '@/components/shared/header/Header';
import { auth } from 'auth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Authentication is handled by middleware, so we just need to get the session
  const session = await auth();

  return (
    <div className="flex h-screen flex-col bg-secondary-100 md:min-h-screen md:p-6 md:pb-3 md:pt-4">
      <Header />
      {/* Top navigation header */}
      <RoleBasedLayout isAdmin={(session?.user as any)?.role === 'Admin'} />
      {' '}
      {/* Renders content based on user role */}
      <main className="scrollbar min-h-0 w-full flex-1 overflow-auto  md:h-3/4">
        {children}
      </main>
    </div>
  );
}
