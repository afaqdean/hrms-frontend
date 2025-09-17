'use client';

import Avatar from '@/components/shared/avatars/avatar/Avatar';

type Employee = {
  _id: string;
  name: string;
  employeeID: string;
  position: string;
  profileImage?: string;
};

type EmployeeDeductionHeaderProps = {
  employee: Employee;
};

const EmployeeDeductionHeader: React.FC<EmployeeDeductionHeaderProps> = ({ employee }) => {
  if (!employee.name) {
    return null;
  }

  return (
    <div className="mb-6 flex items-center border-b pb-4">
      <div className="flex items-center gap-4">
        <Avatar src={employee.profileImage} className="size-16" />
        <div>
          <div className="text-lg font-semibold">{employee.name}</div>
          <div className="text-sm text-gray-500">
            ID:
            {' '}
            {employee.employeeID}
          </div>
          <div className="text-sm text-gray-500">{employee.position}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDeductionHeader;
