'use client';

import LambdaPayrollForm from '@/components/admin/payroll/lambda/LambdaPayrollForm';
import BackArrow from '@/components/ui/back-arrow';
import React from 'react';

const LambdaPayrollProcessingContainer: React.FC = () => {
  return (
    <div className="mt-4 rounded-2xl px-2 md:bg-white md:px-6 md:py-4">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-1">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-4">
              <BackArrow href="/dashboard/admin/payroll-management" />
              <h2 className="text-xl font-bold text-primary-100 md:text-2xl">Generate Payslips</h2>
            </div>
            <p className="text-sm text-secondary-300">
              Upload your payroll files for automated bulk processing through AWS Lambda
            </p>
          </div>
        </div>
        <hr className="mt-3 w-full border-[#F1F1F1] md:my-2" />
      </div>

      <div className="space-y-6">
        <LambdaPayrollForm />
      </div>
    </div>
  );
};

export default LambdaPayrollProcessingContainer;
