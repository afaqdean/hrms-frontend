import { protectAdminRoute } from '@/lib/auth/serverAuth';
import { setRequestLocale } from 'next-intl/server';

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Protect this route - will redirect if not authorized
  await protectAdminRoute(locale);

  return (
    <div className="w-full">
      {children}
    </div>
  );
}
