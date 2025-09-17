// Employee ID validation pattern (format: 37405-1234567-1)
export const EMPLOYEE_ID_PATTERN = /^\d{5}-\d{7}-\d$/;

// File upload configuration
export const EXCEL_FILE_CONFIG = {
  accept: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  supportedFormats: ['XLSX'] as const,
  maxFiles: 1,
};

export const CSV_FILE_CONFIG = {
  accept: { 'text/csv': ['.csv'] },
  supportedFormats: ['CSV'] as const,
  maxFiles: 1,
};

// Status messages
export const STATUS_MESSAGES = {
  PROCESSING_FILE: 'Processing salaries file and checking for HRMS modifications...',
  CHECKING_HRMS: 'Checking for HRMS modifications...',
  HRMS_MODIFICATIONS_DETECTED: '⚠️ HRMS modifications detected! Please review before proceeding.',
  NO_HRMS_MODIFICATIONS: '✅ No HRMS modifications found. Ready for processing.',
  FILE_PROCESSED: '✅ Salaries file processed successfully',
  READY_FOR_PROCESSING: '✅ Ready for processing',
  UPLOADING_FILES: 'Uploading files to backend...',
  VERIFYING_UPLOADS: 'Verifying uploads...',
  FILES_VERIFIED: '✅ Files uploaded and verified successfully! Ready for bulk processing.',
  EXTRACTING_EMPLOYEE_DATA: 'Extracting employee data from files...',
  PROCESSING_INDIVIDUAL: 'Processing individual payroll...',
  INDIVIDUAL_PROCESSED: 'Individual payroll processed! Now generating payslip...',
  GENERATING_PAYSLIPS: 'Generating payslips from Excel file...',
  TRIGGERING_BULK: 'Triggering bulk processing...',
  BULK_STARTED: 'Bulk processing started! Now automatically generating payslips...',
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  HRMS_WARNING: 'HRMS modifications detected! Please review the warning below.',
  FILE_SUCCESS: 'Salaries file processed successfully',
  INDIVIDUAL_SUCCESS: 'Individual payroll processed successfully! Generating payslip...',
  BULK_SUCCESS: 'Bulk processing started! Automatically generating payslips...',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NO_SALARIES_FILE: 'Please select a salaries Excel file',
  NO_EMPLOYEES_FILE: 'Please select an employees CSV file',
  NO_EMPLOYEE_ID: 'Please enter an employee ID',
  INVALID_EMPLOYEE_ID: 'Employee ID must be in format: 37405-1234567-1',
  NO_INDIVIDUAL_SALARIES: 'Please upload a salaries Excel file',
  FILE_NOT_PROCESSED: 'Please wait for the salaries file to be processed',
  UPLOAD_FAILED: 'File upload failed',
  VERIFICATION_FAILED: 'Verification failed',
  BULK_PROCESSING_FAILED: 'Bulk processing failed to trigger',
  INDIVIDUAL_PROCESSING_FAILED: 'Individual processing failed',
  PAYSLIP_GENERATION_FAILED: 'Payslip generation failed',
  EXCEL_UPLOAD_FAILED: 'Excel upload failed',
} as const;
