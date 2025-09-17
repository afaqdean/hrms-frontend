import type { Employee } from '@/interfaces/Employee';
import { Button } from '@/components/ui/button';
import useEmployees from '@/hooks/useEmployees';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type EditAudienceProps = {
  onClose: () => void;
};

const EditAudience: React.FC<EditAudienceProps> = ({ onClose }) => {
  const { Employees: employeeData, isLoading } = useEmployees();
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Sync employees state when data is loaded
  useEffect(() => {
    if (employeeData) {
      const sortedEmployees = [...employeeData].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setEmployees(sortedEmployees);
    }
  }, [employeeData]);

  // Handle employee removal
  // const handleDeleteEmployee = (id: string) => {
  //   setEmployees(prevEmployees => prevEmployees?.filter(employee => employee._id !== id));
  // };

  // Utility function to format and truncate text
  const formatPosition = (position: string, limit: number) => {
    return position
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ')
      .slice(0, limit) + (position.length > limit ? '...' : '');
  };

  return (
    <div className="w-72 rounded-2xl p-2 md:w-full">
      <h4 className="text-base font-medium">Announcement Audience</h4>
      <hr className="my-4 border-gray-200" />

      <div className="scrollbar max-h-96 space-y-4 overflow-y-auto">
        {isLoading
          ? (
              <p className="text-center text-gray-500">Loading employees...</p>
            )
          : employees.length > 0
            ? (
                employees.map(employee => (
                  <div key={employee._id} className="flex items-center gap-3 md:p-4">
                    <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-full ">
                      <Image
                        src={employee.profileImage}
                        alt={employee.name}
                        height={50}
                        width={50}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="text-sm md:text-base">
                        <span className="md:hidden">{employee.name.length > 18 ? `${employee.name.substring(0, 14)}...` : employee.name}</span>
                        <span className="hidden md:block">{employee.name}</span>
                        {' '}
                        <p className="hidden text-xs text-gray-500 md:inline">
                          {formatPosition(employee.position, employee.position.length)}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {formatPosition(employee.position, 10)}
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="text-sm text-red-500 md:text-base"
                        // onClick={() => handleDeleteEmployee(employee._id)}
                      >

                      </Button>
                    </div>
                  </div>
                ))
              )
            : (
                <p className="text-center text-gray-500">No employees available.</p>
              )}
      </div>

      <div className="mt-4 flex w-full gap-2">
        <Button className="w-full" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {/* <Button className="w-1/2">Save</Button>  */}
      </div>
    </div>
  );
};

export default EditAudience;
