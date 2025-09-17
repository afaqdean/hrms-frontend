'use client';

import { API } from '@/Interceptors/Interceptor';
import { useMutation } from '@tanstack/react-query';

export type UploadUrlResponse = {
  uploadUrl: string;
  fileKey: string;
  contentType: string;
  metadata?: Record<string, string>;
};

export type VerificationResponse = {
  success: boolean;
  fileExists: boolean;
  fileSize?: number;
};

export type BulkProcessingResponse = {
  triggered: boolean;
  message: string;
};

export type IndividualProcessingRequest = {
  monthYear?: string;
  name?: string;
  basicSalary?: number;
  medicalAllowance?: number;
  bonus?: number;
  grossSalary?: number;
  salaryTax?: number;
  salaryPayable?: number;
  deductionTripInsurance?: number;
  deductionAdvanceSalary?: number;
};

export type IndividualProcessingResponse = {
  success: boolean;
  payslipGenerated: boolean;
  s3Key: string;
  message: string;
  employeeId: string;
  monthYear: string;
};

export const useLambdaPayroll = () => {
  // Upload both files through backend endpoint
  const uploadFilesMutation = useMutation({
    mutationFn: async ({
      salariesFile,
      employeesFile,
      monthYear,
    }: {
      salariesFile: File;
      employeesFile: File;
      monthYear: string;
    }): Promise<boolean> => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('salariesFile', salariesFile);
      formData.append('employeesFile', employeesFile);
      formData.append('monthYear', monthYear);

      const response = await API.post('/lambda-payroll/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    },
  });

  // Verify that files were uploaded successfully
  const verifyUploadMutation = useMutation({
    mutationFn: async ({
      fileType,
      monthYear,
    }: {
      fileType: 'salaries' | 'employees';
      monthYear: string;
    }): Promise<VerificationResponse | null> => {
      const { data } = await API.post('/lambda-payroll/upload/verify', {
        fileType,
        monthYear,
      });
      return data;
    },
  });

  // Trigger bulk processing
  const triggerBulkProcessingMutation = useMutation({
    mutationFn: async ({
      monthYear,
      processType,
    }: {
      monthYear: string;
      processType: 'all' | 'salaries' | 'employees';
    }): Promise<BulkProcessingResponse | null> => {
      const { data } = await API.post('/lambda-payroll/process/bulk', {
        monthYear,
        processType,
      });
      return data;
    },
  });

  // Process individual employee
  const processIndividualMutation = useMutation({
    mutationFn: async ({
      employeeId,
      payrollData,
    }: {
      employeeId: string;
      payrollData: IndividualProcessingRequest;
    }): Promise<IndividualProcessingResponse | null> => {
      const { data } = await API.post(`/lambda-payroll/process/individual/${employeeId}`, payrollData);
      return data;
    },
  });

  // Wrapper functions to maintain backward compatibility
  const uploadFiles = async (
    salariesFile: File,
    employeesFile: File,
    monthYear: string,
  ): Promise<boolean> => {
    return uploadFilesMutation.mutateAsync({ salariesFile, employeesFile, monthYear });
  };

  const verifyUpload = async (
    fileType: 'salaries' | 'employees',
    monthYear: string,
  ): Promise<VerificationResponse | null> => {
    return verifyUploadMutation.mutateAsync({ fileType, monthYear });
  };

  const triggerBulkProcessing = async (
    monthYear: string,
    processType: 'all' | 'salaries' | 'employees',
  ): Promise<BulkProcessingResponse | null> => {
    return triggerBulkProcessingMutation.mutateAsync({ monthYear, processType });
  };

  const processIndividual = async (
    employeeId: string,
    payrollData: IndividualProcessingRequest,
  ): Promise<IndividualProcessingResponse | null> => {
    return processIndividualMutation.mutateAsync({ employeeId, payrollData });
  };

  // Add missing processIndividualPayroll function (alias for processIndividual)
  const processIndividualPayroll = async (
    employeeId: string,
    payrollData: IndividualProcessingRequest,
  ): Promise<IndividualProcessingResponse | null> => {
    return processIndividualMutation.mutateAsync({ employeeId, payrollData });
  };

  // Add missing retryOperation function
  const retryOperation = async (
    monthYear: string,
    processType: 'all' | 'salaries' | 'employees',
  ): Promise<BulkProcessingResponse | null> => {
    return triggerBulkProcessingMutation.mutateAsync({ monthYear, processType });
  };

  return {
    uploadFiles,
    verifyUpload,
    triggerBulkProcessing,
    processIndividual,
    processIndividualPayroll,
    retryOperation,
    loading: uploadFilesMutation.isPending || verifyUploadMutation.isPending || triggerBulkProcessingMutation.isPending || processIndividualMutation.isPending,
    error: uploadFilesMutation.error?.message || verifyUploadMutation.error?.message || triggerBulkProcessingMutation.error?.message || processIndividualMutation.error?.message || null,
  };
};
