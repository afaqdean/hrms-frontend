'use client';

import Avatar from '@/components/shared/avatars/avatar/Avatar';

type EmployeeHeaderProps = {
  employee: {
    name: string;
    employeeID: string;
    position: string;
    profileImage?: string;
  };
};

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ employee }) => {
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

export default EmployeeHeader;
