export const LOAN_STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Declined', label: 'Declined' },
] as const;

export const LOAN_SOURCE_OPTIONS = [
  { value: 'All', label: 'All Sources' },
  { value: 'manual', label: 'Manual' },
  { value: 'excel_import', label: 'Excel Import' },
] as const;

export const LOAN_STATUS_PRIORITY = {
  Pending: 1,
  Approved: 2,
  Declined: 3,
} as const;

export type LoanStatus = 'Pending' | 'Approved' | 'Declined';
export type LoanSource = 'manual' | 'excel_import';
