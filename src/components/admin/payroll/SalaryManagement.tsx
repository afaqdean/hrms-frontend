'use client';

import type { Employee } from '@/interfaces/Employee';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import useEmployees from '@/hooks/useEmployees';
import useUpdateEmployeeSalary from '@/hooks/useUpdateEmployeeSalary';
import { useRouter } from '@/libs/i18nNavigation';
import { MoreVertical, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '../../shared/avatars/avatar/Avatar';

const SalaryManagement: React.FC = () => {
  const router = useRouter();
  const { Employees, isLoading, isError } = useEmployees();
  const { updateSalary } = useUpdateEmployeeSalary();
  const [searchQuery, setSearchQuery] = useState('');

  // Process employees to ensure they have salary data
  const employeesWithSalary = useMemo(() => {
    if (!Employees) {
      return [];
    }

    return Employees.map((employee: Employee) => ({
      ...employee,
      // Use actual salary if it exists, otherwise it will be undefined
      salary: employee.salary,
    }));
  }, [Employees]);

  // Set salary to 0 for employees who don't have a salary field
  useEffect(() => {
    if (employeesWithSalary.length > 0) {
      employeesWithSalary.forEach((employee) => {
        if (employee.salary === undefined) {
          updateSalary({ employeeId: employee._id, salary: 0 });
        }
      });
    }
  }, [employeesWithSalary, updateSalary]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) {
      return employeesWithSalary;
    }

    const query = searchQuery.toLowerCase();
    return employeesWithSalary.filter(employee =>
      employee.name.toLowerCase().includes(query)
      || employee.email.toLowerCase().includes(query)
      || employee.position.toLowerCase().includes(query)
      || employee.employeeID.toLowerCase().includes(query),
    );
  }, [employeesWithSalary, searchQuery]);

  const handleActionClick = (action: string, employee: Employee) => {
    if (action === 'add-bonus') {
      router.push(`/dashboard/admin/payroll-management/bonus/${employee._id}`);
      return;
    }
    if (action === 'add-deductions') {
      router.push(`/dashboard/admin/payroll-management/deduction/${employee._id}`);
      return;
    }
    if (action === 'manage-loans') {
      router.push(`/dashboard/admin/payroll-management/loan/${employee._id}`);
      return;
    }
    if (action === 'add-salary-increments') {
      router.push(`/dashboard/admin/payroll-management/salary-increment/${employee._id}`);
      return;
    }
    if (action === 'view-salary-change-log') {
      router.push(`/dashboard/admin/payroll-management/salary-change-log/${employee._id}`);
      return;
    }

    // Implement action handlers here
    switch (action) {
      case 'view-salary-change-log':
        // Handle view salary change log
        break;
      case 'show-salary-history':
        // Handle show salary history
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="py-8 text-center text-sm text-gray-600">Loading employees...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow">
        <div className="py-8 text-center text-sm text-red-500">Error loading employees. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredEmployees.length}
          {' '}
          of
          {' '}
          {employeesWithSalary.length}
          {' '}
          employees
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by employee name, email, position, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Employees Table */}
      {filteredEmployees.length === 0
        ? (
            <div className="py-8 text-center text-sm text-gray-600">
              {searchQuery ? 'No employees match your search.' : 'No employees found.'}
            </div>
          )
        : (
            <div className="max-h-[500px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-500">
                    <th className="pb-3 pl-4 pr-3">Employee</th>
                    <th className="px-3 pb-3">Salary</th>
                    <th className="px-3 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 pl-4 pr-3">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={employee.profileImage}
                          />
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {employee.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.position}
                              {' '}
                              • ID:
                              {' '}
                              {employee.employeeID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-base font-semibold text-primary-100">
                          PKR
                          {' '}
                          {employee.salary?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Monthly
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleActionClick('add-bonus', employee)}
                              className="cursor-pointer"
                            >
                              Manage bonus
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleActionClick('add-deductions', employee)}
                              className="cursor-pointer"
                            >
                              Manage deductions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleActionClick('manage-loans', employee)}
                              className="cursor-pointer"
                            >
                              Manage loans
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleActionClick('add-salary-increments', employee)}
                              className="cursor-pointer"
                            >
                              Add salary increments
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleActionClick('view-salary-change-log', employee)}
                              className="cursor-pointer"
                            >
                              View salary change log
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
};

export default SalaryManagement;
