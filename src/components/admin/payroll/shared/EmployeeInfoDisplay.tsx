import Avatar from '@/components/shared/avatars/avatar/Avatar';
import React from 'react';

type Employee = {
  _id?: string;
  name?: string;
  email?: string;
  position?: string;
  employeeID?: string;
  profileImage?: string;
};

type EmployeeInfoDisplayProps = {
  employee: Employee;
  className?: string;
  variant?: 'header' | 'card';
  size?: 'sm' | 'md' | 'lg';
  showBorder?: boolean;
  showEmail?: boolean;
};

const EmployeeInfoDisplay: React.FC<EmployeeInfoDisplayProps> = ({
  employee,
  className = '',
  variant = 'header',
  size = 'md',
  showBorder = false,
  showEmail = false,
}) => {
  const sizeClasses = {
    sm: {
      avatar: 'size-10',
      name: 'text-sm font-medium',
      details: 'text-xs text-gray-500',
      container: 'gap-3',
    },
    md: {
      avatar: 'size-16',
      name: 'text-lg font-semibold',
      details: 'text-sm text-gray-500',
      container: 'gap-4',
    },
    lg: {
      avatar: 'size-20',
      name: 'text-xl font-semibold',
      details: 'text-base text-gray-500',
      container: 'gap-6',
    },
  };

  const classes = sizeClasses[size];
  const borderClass = showBorder ? 'border-b pb-4' : '';
  const paddingClass = variant === 'card' ? 'p-4' : '';

  return (
    <div className={`flex items-center ${classes.container} ${paddingClass} ${borderClass} ${className}`}>
      <Avatar
        src={employee.profileImage}
        className={classes.avatar}
      />
      <div>
        <div className={classes.name}>
          {employee.name || `Employee ${employee._id || 'Unknown'}`}
        </div>
        {employee.employeeID && (
          <div className={classes.details}>
            ID:
            {' '}
            {employee.employeeID}
          </div>
        )}
        {employee.position && (
          <div className={classes.details}>
            {employee.position}
          </div>
        )}
        {showEmail && employee.email && (
          <div className={classes.details}>
            {employee.email}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfoDisplay;
