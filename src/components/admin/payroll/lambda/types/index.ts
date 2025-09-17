import type { SalaryComparisonResult } from '@/hooks/useSalaryComparison';

export type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'verifying'
  | 'ready'
  | 'processing'
  | 'completed'
  | 'error';

export type ProcessingState = {
  status: UploadStatus;
  statusMessage: string;
  showProcessingModal: boolean;
  comparisonResult: ComparisonResult | null;
  showComparisonWarning: boolean;
};

export type BulkProcessingFiles = {
  salariesFile: File | null;
  employeesFile: File | null;
  parsedSalariesData: SalaryData[];
  parsedEmployeesData: EmployeeData[];
};

export type IndividualProcessingData = {
  employeeId: string;
  individualSalariesFile: File | null;
  parsedSalariesData: SalaryData[];
};

export type FormValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

// Safe index signature types for dynamic Excel/CSV data
export type SalaryData = {
  [key: string]: string | number | null | undefined;
};

export type EmployeeData = {
  [key: string]: string | number | null | undefined;
};

// Flexible ComparisonResult that allows both SalaryComparisonResult and additional properties
export type ComparisonResult = SalaryComparisonResult & {
  [key: string]: any; // Allow additional properties for flexibility
};
