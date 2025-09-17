import { API } from '@/Interceptors/Interceptor';

/**
 * Excel Payroll Service
 * Handles all Excel payroll related API calls
 */

export type ExcelUploadResponse = {
  success: boolean;
  message: string;
  data?: {
    totalRecords: number;
    processedSuccessfully: number;
    errors: number;
    warnings: number;
  };
  payslips?: Array<{
    employeeId: string;
    employeeName: string;
    cnic: string;
    period: string;
    netPay: number;
    payslipId: string;
  }>;
  errors?: string[];
  warnings?: string[];
};

export type ExcelValidationResponse = {
  success: boolean;
  message: string;
  data?: {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    errors: string[];
    warnings: string[];
  };
};

export type ExcelCleanupResponse = {
  success: boolean;
  message: string;
  data?: {
    deletedRecords: number;
    deletedPayslips: number;
  };
};

export type ExcelAuditResponse = {
  success: boolean;
  message: string;
  data?: {
    period: string;
    totalRecords: number;
    processedRecords: number;
    errorRecords: number;
    lastProcessed: string;
    processedBy: string;
    auditTrail: Array<{
      action: string;
      timestamp: string;
      user: string;
      details: string;
    }>;
  };
};

// Upload and process Excel payroll file
export const uploadExcelPayroll = async (
  file: File,
  period: string,
  paymentDate?: string,
): Promise<ExcelUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('period', period);
  if (paymentDate) {
    formData.append('paymentDate', paymentDate);
  }

  const response = await API.post('/excel-payroll/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Validate Excel payroll file without processing
export const validateExcelPayroll = async (
  file: File,
  period: string,
): Promise<ExcelValidationResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('period', period);

  const response = await API.post('/excel-payroll/validate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Clean up all data for a period
export const cleanupExcelPayroll = async (
  period: string,
): Promise<ExcelCleanupResponse> => {
  const response = await API.post(`/excel-payroll/cleanup/${period}`);
  return response.data;
};

// Get audit information for Excel-imported data
export const getExcelPayrollAudit = async (
  period: string,
): Promise<ExcelAuditResponse> => {
  const response = await API.get(`/excel-payroll/audit/${period}`);
  return response.data;
};

// Export all functions as a service object for easier imports
export const excelPayrollService = {
  uploadExcelPayroll,
  validateExcelPayroll,
  cleanupExcelPayroll,
  getExcelPayrollAudit,
};
