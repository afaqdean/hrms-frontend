import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type SmartBackButtonProps = {
  employeeId: string;
  className?: string;
};

export const SmartBackButton = ({ employeeId, className = '' }: SmartBackButtonProps) => {
  return (
    <Link
      href={`/dashboard/admin/payroll-management/loan/${employeeId}`}
      className={`inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 ${className}`}
    >
      <ArrowLeft className="size-5" />
      <span className="hidden sm:inline">Back to Employee Loans</span>
    </Link>
  );
};
