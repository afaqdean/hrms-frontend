import { protectAdminRoute } from '@/lib/auth/serverAuth';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protect this route - will redirect if not authorized
  await protectAdminRoute();

  return (
    <div className="w-full">
      {children}
    </div>
  );
}
