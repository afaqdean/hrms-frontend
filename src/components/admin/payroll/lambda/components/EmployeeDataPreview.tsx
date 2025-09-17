'use client';

import type { EmployeeData, SalaryData } from '../types';
import { findEmployeeInFiles } from '@/hooks/useProcessFile';

import React from 'react';

type EmployeeDataPreviewProps = {
  employeeId: string;
  parsedSalariesData: SalaryData[];
  parsedEmployeesData: EmployeeData[];
  isVisible: boolean;
};

const EmployeeDataPreview: React.FC<EmployeeDataPreviewProps> = ({
  employeeId,
  parsedSalariesData,
  parsedEmployeesData,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  const { salaryData, error, debugInfo } = findEmployeeInFiles(
    employeeId,
    parsedSalariesData,
    parsedEmployeesData,
  );

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="mb-2 font-semibold text-gray-800">
        Employee Data Preview:
      </h4>

      {error
        ? (
            <div className="space-y-2 text-sm text-red-600">
              <p>
                ❌
                {error}
              </p>
              {debugInfo && (
                <div className="rounded bg-red-50 p-2 text-xs">
                  <p>
                    <strong>Available columns:</strong>
                    {' '}
                    {debugInfo.availableColumns?.join(', ')}
                  </p>
                  <p>
                    <strong>Sample IDs found:</strong>
                    {' '}
                    {debugInfo.sampleIds?.slice(0, 3).join(' | ')}
                  </p>
                </div>
              )}
            </div>
          )
        : (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <strong>Name:</strong>
                    {' '}
                    {salaryData?.Name || 'N/A'}
                  </p>
                  <p>
                    <strong>Basic Salary:</strong>
                    {' '}
                    {salaryData?.['Basic Salary'] || 'N/A'}
                  </p>
                  <p>
                    <strong>Medical Allowance:</strong>
                    {' '}
                    {salaryData?.['Medical Allowance'] || 'N/A'}
                  </p>
                  <p>
                    <strong>Bonus:</strong>
                    {' '}
                    {salaryData?.Bonus || 'N/A'}
                  </p>
                  <p>
                    <strong>Gross Salary:</strong>
                    {' '}
                    {salaryData?.['Gross Salary'] || 'N/A'}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Salary Tax:</strong>
                    {' '}
                    {salaryData?.['Salary tax'] || 'N/A'}
                  </p>
                  <p>
                    <strong>Salary Payable:</strong>
                    {' '}
                    {salaryData?.['Salary Payable'] || 'N/A'}
                  </p>
                  <p>
                    <strong>Trip Insurance Deduction:</strong>
                    {' '}
                    {salaryData?.['Trip/Insurance'] || 'N/A'}
                  </p>
                  <p>
                    <strong>Advance Salary Deduction:</strong>
                    {' '}
                    {salaryData?.['Advance salary Deduction'] || 'N/A'}
                  </p>
                </div>
              </div>
              <p className="font-medium text-green-600">
                ✅ Employee found in salaries file - Ready to process
              </p>
            </div>
          )}
    </div>
  );
};

export default EmployeeDataPreview;
