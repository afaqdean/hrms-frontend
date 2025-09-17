import type { Employee } from '@/interfaces/Employee';
import useEmployees from '@/hooks/useEmployees';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useSelectedEmployee = () => {
  const { slug } = useParams();
  const employeeId = Array.isArray(slug) ? slug[0] : slug; // Ensure it's always a string

  const { Employees: employeeData = [], isLoading: employeeLoading } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(employeeId || null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  useEffect(() => {
    if (employeeId) {
      setSelectedEmployeeId(employeeId);
      const employee = employeeData.find(emp => emp._id === employeeId);
      setSelectedEmployee(employee);
    }
  }, [employeeId, employeeData]);

  return {
    selectedEmployeeId,
    selectedEmployee,
    setSelectedEmployeeId,
    employeeData,
    employeeLoading,
  };
};

export default useSelectedEmployee;
