import type { LoanRequest } from '@/interfaces/LoanRequest';
import React from 'react';
import LoanTableHeader from './LoanTableHeader';
import LoanTableRow from './LoanTableRow';

type LoanTableProps = {
  loanRequests: LoanRequest[];
  showEmployeeColumn?: boolean;
  onView: (loan: LoanRequest) => void;
  onEdit: (loan: LoanRequest) => void;
  onDelete: (loanId: string) => void;
  className?: string;
};

const LoanTable: React.FC<LoanTableProps> = ({
  loanRequests,
  showEmployeeColumn = true,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <LoanTableHeader showEmployeeColumn={showEmployeeColumn} />
        <tbody>
          {loanRequests.map(loanRequest => (
            <LoanTableRow
              key={loanRequest._id}
              loanRequest={loanRequest}
              showEmployeeColumn={showEmployeeColumn}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanTable;
