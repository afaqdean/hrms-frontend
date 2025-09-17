'use client';

import { useApplyLoanRequest } from '@/hooks/useApplyLoanRequest';
import React from 'react';

type ApplyLoanRequestFormProps = {
  onClose: () => void;
};

const ApplyLoanRequestForm: React.FC<ApplyLoanRequestFormProps> = ({ onClose }) => {
  const { mutate, isPending } = useApplyLoanRequest();
  const [amount, setAmount] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [installments, setInstallments] = React.useState(1);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!reason.trim()) {
      setError('Please enter a reason.');
      return;
    }
    mutate(
      { amount: amt, reason, installments },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: Error) => {
          // Handle both standard Error and API-like errors safely
          const errorMessage = (() => {
            // Check if err has response-like properties (API error)
            if (err && typeof err === 'object' && 'response' in err) {
              const apiError = err as { response?: { data?: { message?: string } } };
              if (apiError.response?.data?.message) {
                return apiError.response.data.message;
              }
            }

            // Fallback to standard Error message or default
            return err.message || 'Failed to apply for loan.';
          })();

          setError(errorMessage);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-2xl border border-gray-100 bg-white p-12 shadow-2xl"
    >
      <h2 className="mb-4 text-center text-2xl font-bold text-primary-100">Apply for Loan</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="loan-amount" className="mb-1 block text-sm font-medium">Amount (PKR)</label>
        <input
          id="loan-amount"
          type="number"
          min={1}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="loan-reason" className="mb-1 block text-sm font-medium">Reason</label>
        <textarea
          id="loan-reason"
          className="min-h-[80px] w-full rounded-lg border border-gray-200 px-4 py-3 text-base shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="loan-installments" className="mb-1 block text-sm font-medium">Installments</label>
        <select
          id="loan-installments"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
          value={installments}
          onChange={e => setInstallments(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      {error && <div className="mt-2 text-center text-sm text-red-500">{error}</div>}
      <div className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          className="flex-1 rounded-lg border border-gray-200 bg-gray-100 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-primary-100 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-100/90"
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ApplyLoanRequestForm;
