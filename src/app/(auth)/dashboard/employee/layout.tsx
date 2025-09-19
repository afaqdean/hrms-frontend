import { protectEmployeeRoute } from '@/lib/auth/serverAuth';

export default async function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Protect this route - will redirect if not authorized
  await protectEmployeeRoute();

  return (
    <div className="w-full">
      {children}
    </div>
  );
}
