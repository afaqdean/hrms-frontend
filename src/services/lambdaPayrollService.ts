import { API } from '@/Interceptors/Interceptor';

/**
 * Lambda Payroll Service
 * Handles all Lambda payroll related API calls
 */

export type FileUploadResponse = {
  success: boolean;
  message: string;
  data?: {
    fileUrls: string[];
    uploadId: string;
  };
};

export type PresignedUrlResponse = {
  success: boolean;
  message: string;
  data?: {
    uploadUrl: string;
    fileKey: string;
    expiresAt: string;
  };
};

export type VerificationResponse = {
  success: boolean;
  message: string;
  data?: {
    fileExists: boolean;
    fileSize: number;
    lastModified: string;
    checksum: string;
  };
};

export type BulkProcessingResponse = {
  success: boolean;
  message: string;
  data?: {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    estimatedCompletion: string;
  };
};

export type IndividualProcessingResponse = {
  success: boolean;
  message: string;
  data?: {
    employeeId: string;
    monthYear: string;
    payslipId: string;
    netPay: number;
    processingTime: number;
  };
};

export type FileListResponse = {
  success: boolean;
  message: string;
  data?: {
    files: Array<{
      fileName: string;
      fileKey: string;
      fileSize: number;
      uploadDate: string;
      fileType: 'salaries' | 'employees';
      status: 'uploaded' | 'processing' | 'processed' | 'error';
    }>;
    totalFiles: number;
    currentMonth: string;
  };
};

export type StatusResponse = {
  success: boolean;
  message: string;
  data?: {
    serviceStatus: 'healthy' | 'degraded' | 'down';
    lastHealthCheck: string;
    activeJobs: number;
    queueSize: number;
    version: string;
  };
};

export type HealthResponse = {
  success: boolean;
  message: string;
  data?: {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
};

export type PayslipDownloadResponse = {
  success: boolean;
  message: string;
  data?: {
    downloadUrl: string;
    password: string;
    expiresAt: string;
    fileName: string;
  };
};

// Upload files directly to Lambda S3 via backend
export const uploadFilesToLambda = async (
  salariesFile: File,
  employeesFile: File,
  monthYear: string,
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('salariesFile', salariesFile);
  formData.append('employeesFile', employeesFile);
  formData.append('monthYear', monthYear);

  const response = await API.post('/lambda-payroll/upload/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get presigned URL for file upload to Lambda S3
export const getPresignedUploadUrl = async (
  fileName: string,
  fileType: 'salaries' | 'employees',
  monthYear: string,
): Promise<PresignedUrlResponse> => {
  const response = await API.post('/lambda-payroll/upload/get-urls', {
    fileName,
    fileType,
    monthYear,
  });
  return response.data;
};

// Verify file upload success
export const verifyFileUpload = async (
  fileType: 'salaries' | 'employees',
  monthYear: string,
): Promise<VerificationResponse> => {
  const response = await API.post('/lambda-payroll/upload/verify', {
    fileType,
    monthYear,
  });
  return response.data;
};

// List uploaded files for current month
export const getUploadedFiles = async (): Promise<FileListResponse> => {
  const response = await API.get('/lambda-payroll/files');
  return response.data;
};

// Get Lambda payroll system status
export const getLambdaPayrollStatus = async (): Promise<StatusResponse> => {
  const response = await API.get('/lambda-payroll/status');
  return response.data;
};

// Process individual employee payslip via Lambda
export const processIndividualPayslip = async (
  payrollData: any,
): Promise<IndividualProcessingResponse> => {
  const response = await API.post('/lambda-payroll/process/individual', payrollData);
  return response.data;
};

// Process individual employee payslip by CNIC via Lambda
export const processIndividualPayslipByEmployeeId = async (
  employeeId: string,
  payrollData: any,
): Promise<IndividualProcessingResponse> => {
  const response = await API.post(`/lambda-payroll/process/individual/${employeeId}`, payrollData);
  return response.data;
};

// Trigger bulk payroll processing via Lambda
export const triggerBulkPayrollProcessing = async (
  monthYear: string,
  processType: 'all' | 'salaries' | 'employees',
): Promise<BulkProcessingResponse> => {
  const response = await API.post('/lambda-payroll/process/bulk', {
    monthYear,
    processType,
  });
  return response.data;
};

// Get payslip download URL and password from Lambda
export const getPayslipDownloadInfo = async (
  employeeId: string,
  monthYear: string,
): Promise<PayslipDownloadResponse> => {
  const response = await API.get(`/lambda-payroll/payslips/${employeeId}/${monthYear}/download`);
  return response.data;
};

// Check Lambda payroll service health
export const checkLambdaPayrollHealth = async (): Promise<HealthResponse> => {
  const response = await API.get('/lambda-payroll/health');
  return response.data;
};

// Export all functions as a service object for easier imports
export const lambdaPayrollService = {
  uploadFilesToLambda,
  getPresignedUploadUrl,
  verifyFileUpload,
  getUploadedFiles,
  getLambdaPayrollStatus,
  processIndividualPayslip,
  processIndividualPayslipByEmployeeId,
  triggerBulkPayrollProcessing,
  getPayslipDownloadInfo,
  checkLambdaPayrollHealth,
};
