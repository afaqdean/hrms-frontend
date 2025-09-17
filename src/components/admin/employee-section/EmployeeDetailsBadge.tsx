import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

type EmployeeProfileBadgeProps = {
  imgSrc: string;
  employeeName: string;
  employeePosition: string;
  joiningDate: string;
  employeeId: string;
};

const EmployeeDetailsBadge: React.FC<EmployeeProfileBadgeProps> = ({
  imgSrc,
  employeeName,
  employeePosition,
  joiningDate,
  employeeId,
}) => {
  const router = useRouter();

  const handlePerformanceReview = () => {
    router.push(`/dashboard/admin/performance-review/${employeeId}`);
  };

  return (
    <div className="flex w-full flex-col items-center space-y-2 text-center md:space-y-4">
      <Image
        src={imgSrc}
        alt="Profile"
        className="size-16 rounded-full md:size-28"
        width={100}
        height={100}
      />
      <h3 className="text-lg font-semibold">{employeeName}</h3>
      <div className="rounded-full bg-secondary-100 px-3 text-primary-100">
        <span>{employeePosition}</span>
      </div>
      <p className="text-sm text-gray-500">
        From:
        {' '}
        <span>{joiningDate}</span>
        {' '}
        - Current Date
      </p>
      <Button
        onClick={handlePerformanceReview}
        variant="outline"
        size="default"
        className="ml-2"
      >
        Manage Reviews
      </Button>
    </div>
  );
};

export default EmployeeDetailsBadge;
