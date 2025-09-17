import { EmployeeInfoDisplay } from '@/components/admin/payroll/shared';
import React from 'react';

type Employee = {
  _id?: string;
  name?: string;
  email?: string;
  position?: string;
  employeeID?: string;
  profileImage?: string;
};

type EmployeeInfoCardProps = {
  employee: Employee;
  className?: string;
  showBorder?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({
  employee,
  className = '',
  showBorder = true,
  size = 'md',
}) => {
  return (
    <EmployeeInfoDisplay
      employee={employee}
      variant="card"
      size={size}
      showBorder={showBorder}
      showEmail
      className={className}
    />
  );
};

export default EmployeeInfoCard;
