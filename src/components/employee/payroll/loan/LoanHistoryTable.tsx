'use client';

import LoadingState from '@/components/ui/LoadingState';
import { useLoanHistory } from '@/hooks/useLoanHistory';
import React from 'react';

const LoanHistoryTable: React.FC = () => {
  const { data, isLoading, isError, error } = useLoanHistory();

  return (
    <div className="max-h-[350px] w-full min-w-[700px] overflow-auto rounded-2xl bg-white p-4 shadow-md">
      {isLoading
        ? (
            <LoadingState
              type="loading"
              message="Loading loan history..."
              showSpinner
              className="h-full min-h-[120px]"
            />
          )
        : isError
          ? (
              <LoadingState
                type="error"
                message="Error loading loan history"
                contextText={error ? String(error) : 'Unable to load loan history.'}
                showSpinner={false}
                className="h-full min-h-[120px]"
              />
            )
          : (
              <table className="w-full min-w-[700px] text-left text-sm text-gray-600">
                <thead className="sticky top-0 z-10 bg-secondary-100 text-xs font-medium uppercase text-gray-700">
                  <tr>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Loan Amount (PKR)</th>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Status</th>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Deductions Per Month (PKR)</th>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Deduction Start Period</th>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Installments</th>
                    <th className="whitespace-nowrap px-6 py-3 text-center">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((loan) => {
                    return (
                      <tr key={loan._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-center text-base font-semibold text-primary-100">{loan.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold
                              ${loan.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : loan.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : loan.status === 'Declined'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-200 text-gray-600'}
                            `}
                          >
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-base font-semibold text-gray-900">{loan.deductionPerMonth.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{loan.requestedAt ? new Date(loan.requestedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '-'}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{loan.installments}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{loan.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
    </div>
  );
};

export default LoanHistoryTable;
