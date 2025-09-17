import React from 'react';

type LoanStatsProps = {
  filteredCount: number;
  totalCount: number;
  employeeId?: string;
  className?: string;
};

const LoanStats: React.FC<LoanStatsProps> = ({
  filteredCount,
  totalCount,
  employeeId,
  className = '',
}) => {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <span className="text-lg font-semibold text-gray-900">
        {employeeId ? 'Employee Loan Requests' : 'Loan Requests'}
      </span>
      <div className="text-sm text-gray-600">
        {filteredCount}
        {' '}
        of
        {employeeId ? filteredCount : totalCount}
        {' '}
        requests
      </div>
    </div>
  );
};

export default LoanStats;
