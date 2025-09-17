import type { DeductionType } from '@/interfaces/Deduction';

export const DEDUCTION_TYPES: Array<{ value: DeductionType; label: string }> = [
  { value: 'advance_salary', label: 'Advance Salary' },
  { value: 'deal', label: 'Deal' },
  { value: 'trip_insurance', label: 'Trip/Insurance' },
  { value: 'leave', label: 'Leave' },
  { value: 'rent', label: 'Rent' },
  { value: 'provident_fund', label: 'Provident Fund' },
  { value: 'eobi', label: 'EOBI' },
  { value: 'tax', label: 'Tax' },
];

/**
 * Get the proper label for a deduction type
 */
export const getDeductionTypeLabel = (type: string): string => {
  const deductionType = DEDUCTION_TYPES.find(dt => dt.value === type);
  return deductionType ? deductionType.label : type.charAt(0).toUpperCase() + type.slice(1);
};
