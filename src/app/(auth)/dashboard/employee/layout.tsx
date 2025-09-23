export default async function EmployeeLayout({
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
