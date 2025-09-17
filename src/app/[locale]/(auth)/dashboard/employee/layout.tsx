import { protectEmployeeRoute } from '@/lib/auth/serverAuth';
import { setRequestLocale } from 'next-intl/server';

export default async function EmployeeLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Protect this route - will redirect if not authorized
  await protectEmployeeRoute(locale);

  return (
    <div className="w-full">
      {children}
    </div>
  );
}
