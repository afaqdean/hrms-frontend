export type LoanRequest = {
  _id: string;
  employeeId: string;
  employeeName?: string; // Optional - may need to be populated from employee data
  employeeEmail?: string; // Optional - may need to be populated from employee data
  employeeProfileImage?: string; // Optional - may need to be populated from employee data
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  requestedAt: string;
  installments: number;
  deductionPerMonth: number;
  remainingAmount: number;
  adminRemarks?: string;
  deductionStartDate?: string;
  source: 'manual' | 'excel_import'; // Added: Loan source tracking
  excelPeriodAmount?: Map<string, number>; // Added: Excel period-specific amounts
  createdAt: string;
  updatedAt: string;
};

export type UpdateLoanRequestInput = {
  status: 'Pending' | 'Approved' | 'Declined';
  installments?: number;
  deductionStartMonth?: string; // Format: "2025-08"
  adminRemarks?: string;
};
