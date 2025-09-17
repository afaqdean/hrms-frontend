import type { EmployeeInfo } from '@/types/salaryHistory';
import { EmployeeInfoDisplay } from '@/components/admin/payroll/shared';
import React from 'react';

type EmployeeHeaderProps = {
  employee: EmployeeInfo;
};

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ employee }) => {
  return (
    <EmployeeInfoDisplay
      employee={employee}
      variant="header"
      size="md"
    />
  );
};

export default EmployeeHeader;
