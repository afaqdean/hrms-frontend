'use client';

import SalaryManagement from '@/components/admin/payroll/SalaryManagement';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/libs/i18nNavigation';
import React from 'react';
import { HiDocumentText } from 'react-icons/hi';

const PayrollManagementContainer: React.FC = () => {
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-100">Payroll Management</h1>

        <Button
          onClick={() => router.push('/dashboard/admin/payroll-management/lambda-processing')}
          className="bg-black text-white hover:bg-gray-800 sm:w-auto"
        >
          <HiDocumentText className="mr-2 size-4" />
          Generate payslips
        </Button>
      </div>

      <SalaryManagement />
    </div>
  );
};

export default PayrollManagementContainer;
