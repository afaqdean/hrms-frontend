'use client';

import React from 'react';

type HowItWorksSectionProps = {
  isIndividualMode: boolean;
};

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  isIndividualMode,
}) => {
  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex items-start">
        <span className="mr-3 text-xl"></span>
        <div className="flex-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            How
            {' '}
            {isIndividualMode ? 'Individual' : 'Bulk'}
            {' '}
            Processing Works:
          </h3>

          {isIndividualMode
            ? (
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Upload the salaries Excel file containing all employee data
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Enter the specific employee ID (CNIC) you want to process
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    The system will find and extract that employee's data from the
                    salaries file
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Payslip will be generated and emailed immediately (no queue)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    All salary data (name, basic salary, allowances, deductions)
                    comes from the Excel file
                  </li>
                </ul>
              )
            : (
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Upload both salaries.xlsx and employees.csv files to AWS S3
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Files are verified to ensure they exist and are properly
                    formatted
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    AWS Lambda function processes all employees in the background
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    After bulk processing starts, payslip generation begins automatically
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Uses the same uploaded Excel file and selected period
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    Payment date auto-calculated as end of selected month
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5 text-primary-100">•</span>
                    All payslips generated automatically - no additional user action required
                  </li>
                </ul>
              )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
