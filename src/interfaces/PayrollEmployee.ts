import type { Employee } from './Employee';

type LoanDeduction = {
  amount: number;
};

type PayrollEmployee = Employee & {
  netPay: number;
  deductions: number;
  bonuses: number;
  loanDeductions: LoanDeduction[];
  hasActiveLoan: boolean;
  salaryChanged: boolean;
};

export type { LoanDeduction, PayrollEmployee };
