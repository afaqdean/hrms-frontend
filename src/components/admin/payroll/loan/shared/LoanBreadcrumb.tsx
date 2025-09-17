import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type LoanBreadcrumbProps = {
  employee: {
    _id: string;
    name: string;
  } | null;
  loanId: string;
  currentPage: 'view' | 'edit';
};

export const LoanBreadcrumb = ({ employee, loanId, currentPage }: LoanBreadcrumbProps) => {
  return (
    <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
      <Link
        href="/dashboard/admin/payroll-management/loan"
        className="transition-colors hover:text-blue-600"
      >
        All Loans
      </Link>
      <ChevronRight className="size-4" />

      {employee
        ? (
            <>
              <Link
                href={`/dashboard/admin/payroll-management/loan/${employee._id}`}
                className="transition-colors hover:text-blue-600"
              >
                {employee.name}
                's Loans
              </Link>
              <ChevronRight className="size-4" />
            </>
          )
        : (
            <>
              <span className="text-gray-400">Employee Loans</span>
              <ChevronRight className="size-4" />
            </>
          )}

      <span className="font-medium text-gray-900">
        {currentPage === 'view' ? 'View' : 'Edit'}
        {' '}
        Loan #
        {loanId.slice(-6)}
      </span>
    </nav>
  );
};
