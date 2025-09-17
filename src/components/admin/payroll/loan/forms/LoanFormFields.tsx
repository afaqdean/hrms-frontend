import type { LoanFormFieldProps, LoanFormSelectProps } from './LoanFormTypes';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { LoanSourceBadge } from '../shared';
import { calculateMonthlyDeduction, formatCurrency } from '../utils';

// Read-only amount field
export const LoanAmountField: React.FC<{ amount: string }> = ({ amount }) => (
  <div>
    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
      Loan Amount (PKR)
    </label>
    <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
      {formatCurrency(Number.parseFloat(amount) || 0)}
    </div>
    <p className="mt-1 text-xs text-gray-500">Amount cannot be modified after request creation</p>
  </div>
);

// Installments input field
export const LoanInstallmentsField: React.FC<LoanFormFieldProps & { required?: boolean }> = ({
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}) => (
  <div>
    <label htmlFor="installments" className="block text-sm font-medium text-gray-700">
      Number of Installments
    </label>
    <Input
      id="installments"
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Enter number of months"
      className="mt-1"
      disabled={disabled}
      required={required}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Status select field
export const LoanStatusField: React.FC<LoanFormSelectProps> = ({
  value,
  onChange,
  options,
  error,
  disabled = false,
}) => (
  <div>
    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
      Status
    </label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="mt-1">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Monthly deduction display (read-only)
export const LoanMonthlyDeductionField: React.FC<{ amount: string; installments: string }> = ({
  amount,
  installments,
}) => {
  const monthlyDeduction = calculateMonthlyDeduction(
    Number.parseFloat(amount) || 0,
    Number.parseInt(installments, 10) || 0,
  );

  return (
    <div>
      <label htmlFor="monthlyDeduction" className="block text-sm font-medium text-gray-700">
        Monthly Deduction (PKR)
      </label>
      <div id="monthlyDeduction" className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
        {formatCurrency(monthlyDeduction)}
      </div>
      <p className="mt-1 text-xs text-gray-500">Calculated automatically based on amount and installments</p>
    </div>
  );
};

// Source display (read-only)
export const LoanSourceField: React.FC<{ source: 'manual' | 'excel_import' }> = ({ source }) => (
  <div>
    <label htmlFor="loanSource" className="block text-sm font-medium text-gray-700">
      Loan Source
    </label>
    <div id="loanSource" className="mt-1">
      <LoanSourceBadge source={source} className="px-3 py-2" />
    </div>
    <p className="mt-1 text-xs text-gray-500">
      {source === 'manual'
        ? 'Created through HRMS system'
        : 'Imported from Excel payroll file'}
    </p>
  </div>
);

// Reason display (read-only)
export const LoanReasonField: React.FC<{ reason: string }> = ({ reason }) => (
  <div>
    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
      Reason for Loan
    </label>
    <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900">
      {reason}
    </div>
    <p className="mt-1 text-xs text-gray-500">Reason cannot be modified after request creation</p>
  </div>
);

// Admin remarks textarea
export const LoanAdminRemarksField: React.FC<LoanFormFieldProps & { rows?: number }> = ({
  value,
  onChange,
  error,
  disabled = false,
  rows = 4,
}) => (
  <div>
    <label htmlFor="adminRemarks" className="block text-sm font-medium text-gray-700">
      Admin Remarks
    </label>
    <Textarea
      id="adminRemarks"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Add any admin remarks or notes"
      className="mt-1"
      rows={rows}
      disabled={disabled}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
