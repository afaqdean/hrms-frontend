import type { LoanRequest } from '@/interfaces/LoanRequest';
import Avatar from '@/components/shared/avatars/avatar/Avatar';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import React from 'react';
import { LoanSourceBadge, LoanStatusBadge } from '../shared';
import { formatCurrency, formatEmployeeEmail, formatEmployeeName, formatInstallments, formatLoanDate } from '../utils';

type LoanTableRowProps = {
  loanRequest: LoanRequest;
  showEmployeeColumn?: boolean;
  onView: (loan: LoanRequest) => void;
  onEdit: (loan: LoanRequest) => void;
  onDelete: (loanId: string) => void;
  className?: string;
};

const LoanTableRow: React.FC<LoanTableRowProps> = ({
  loanRequest,
  showEmployeeColumn = true,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <tr className={`border-b hover:bg-gray-50 ${className}`}>
      {showEmployeeColumn && (
        <td className="py-4 pl-4 pr-3">
          <div className="flex items-center space-x-3">
            <Avatar
              src={loanRequest.employeeProfileImage || '/assets/profile_avatar_placeholder.png'}
            />
            <div>
              <div className="text-base font-semibold text-gray-900">
                {formatEmployeeName(loanRequest.employeeName, loanRequest.employeeId as string)}
              </div>
              <div className="text-sm text-gray-600">
                {formatEmployeeEmail(loanRequest.employeeEmail)}
              </div>
            </div>
          </div>
        </td>
      )}
      <td className="px-3 py-4">
        <div className="text-base font-semibold text-primary-100">
          {formatCurrency(loanRequest.amount)}
        </div>
        <div className="text-sm text-gray-600">
          {loanRequest.deductionPerMonth.toLocaleString()}
          /month
        </div>
        {/* Show Excel period amounts if available */}
        {loanRequest.source === 'excel_import' && loanRequest.excelPeriodAmount && (
          <div className="mt-1 text-xs text-purple-600">
            <div className="text-xs font-semibold">Excel Periods:</div>
            {Array.from(loanRequest.excelPeriodAmount.entries()).map(([period, amount]) => (
              <div key={period} className="flex justify-between">
                <span>
                  {period}
                  :
                </span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        )}
      </td>
      <td className="px-3 py-4 text-sm text-gray-600">
        {formatInstallments(loanRequest.installments)}
      </td>
      <td className="px-3 py-4">
        <LoanStatusBadge status={loanRequest.status} />
      </td>
      <td className="px-3 py-4">
        <LoanSourceBadge source={loanRequest.source} />
      </td>
      <td className="px-3 py-4 text-sm text-gray-600">
        {formatLoanDate(loanRequest.requestedAt, loanRequest.createdAt)}
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(loanRequest)}
            className="flex items-center space-x-1"
          >
            <Eye className="size-4" />
            <span>View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(loanRequest)}
            className="flex items-center space-x-1"
          >
            <Edit className="size-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(loanRequest._id)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default LoanTableRow;
