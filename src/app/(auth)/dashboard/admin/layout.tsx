export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Authentication is handled by middleware
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
