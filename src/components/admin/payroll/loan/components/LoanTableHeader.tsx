import React from 'react';

type LoanTableHeaderProps = {
  showEmployeeColumn?: boolean;
  className?: string;
};

const LoanTableHeader: React.FC<LoanTableHeaderProps> = ({
  showEmployeeColumn = true,
  className = '',
}) => {
  return (
    <thead className={className}>
      <tr className="border-b text-left text-sm font-medium text-gray-500">
        {showEmployeeColumn && <th className="pb-3 pl-4 pr-3">Employee</th>}
        <th className="px-3 pb-3">Amount</th>
        <th className="px-3 pb-3">Installments</th>
        <th className="px-3 pb-3">Status</th>
        <th className="px-3 pb-3">Source</th>
        <th className="px-3 pb-3">Requested Date</th>
        <th className="px-3 pb-3">Actions</th>
      </tr>
    </thead>
  );
};

export default LoanTableHeader;
