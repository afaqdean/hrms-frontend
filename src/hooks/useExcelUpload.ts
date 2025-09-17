'use client';

import { API } from '@/Interceptors/Interceptor';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { parseCookies } from 'nookies';

export type ExcelUploadRequest = {
  period: string; // Format: YYYY-MM
  paymentDate?: string; // Auto-calculated as end of selected month
};

export type ExcelUploadResponse = {
  message: string;
  data: {
    success: boolean;
    summary: {
      totalRecords: number;
      processedSuccessfully: number;
      errors: number;
      warnings: number;
    };
    payslips: Array<{
      employeeId: string;
      employeeName: string;
      cnic: string;
      period: string;
      netPay: number;
      payslipId: string;
    }>;
    errors: string[];
    warnings: string[];
  };
};

export const useExcelUpload = () => {
  const uploadMutation = useMutation({
    mutationFn: async ({
      excelFile,
      period,
    }: {
      excelFile: File;
      period: string;
    }): Promise<ExcelUploadResponse | null> => {
      // Auto-calculate payment date as end of selected month
      const parts = period.split('-');
      const year = parts[0];
      const month = parts[1];
      if (!year || !month) {
        throw new Error('Invalid period format. Expected YYYY-MM');
      }
      const paymentDate = new Date(Number.parseInt(year), Number.parseInt(month), 0).toISOString().split('T')[0]; // Last day of month

      // Ensure paymentDate is defined
      if (!paymentDate) {
        throw new Error('Failed to calculate payment date');
      }

      // Create FormData for file upload (matching backend expectations)
      const formData = new FormData();
      formData.append('file', excelFile); // Backend specification says 'file' field name
      formData.append('period', period); // Format: YYYY-MM
      formData.append('paymentDate', paymentDate); // Optional: defaults to current date if not provided

      // Debug: Also try alternative field names to be sure
      console.warn('Testing with field name "file"...');

      // Validate period format (must match backend regex: ^\d{4}-\d{2}$)
      const periodRegex = /^\d{4}-\d{2}$/;
      if (!periodRegex.test(period)) {
        throw new Error(`Invalid period format. Expected YYYY-MM, got: ${period}`);
      }

      console.warn('Uploading Excel file for payslip generation:', {
        fileName: excelFile.name,
        fileSize: excelFile.size,
        fileType: excelFile.type,
        period,
        paymentDate,
        periodValid: periodRegex.test(period),
        endpoint: '/excel-payroll/upload',
      });

      // Log FormData contents for debugging
      console.warn('FormData contents:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.warn(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
            isFile: true,
          });
        } else {
          console.warn(`${key}:`, value);
        }
      }

      // Additional validation - ensure file exists and is valid
      if (!excelFile || excelFile.size === 0) {
        throw new Error('Invalid Excel file: File is empty or null');
      }

      if (!excelFile.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Invalid file type: Only .xlsx and .xls files are allowed');
      }

      console.warn('Making API request to /excel-payroll/upload...');

      // Create a custom axios instance to avoid interceptor conflicts
      const cookies = parseCookies();
      const token = cookies.token;

      const customAxios = axios.create({
        baseURL: API.defaults.baseURL,
      });

      const response = await customAxios.post('/excel-payroll/upload', formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.warn('Request completed, processing response...');

      // Handle the nested response structure from backend
      // Check for success - could be response.data.data.success === true OR a success message
      const isSuccess = response.data.data && (
        response.data.data.success === true
        || (response.data.message && response.data.message.toLowerCase().includes('successfully'))
        || (response.data.message && response.data.message.toLowerCase().includes('completed'))
      );

      if (isSuccess) {
        console.warn('Excel upload successful:', response.data);
        return response.data;
      } else {
        console.error('Excel upload failed:', response.data);
        throw new Error(response.data.message || 'Excel upload failed');
      }
    },
  });

  const uploadExcel = async (
    excelFile: File,
    period: string, // YYYY-MM format
  ): Promise<ExcelUploadResponse | null> => {
    return uploadMutation.mutateAsync({ excelFile, period });
  };

  return {
    uploadExcel,
    loading: uploadMutation.isPending,
    error: uploadMutation.error?.message || null,
  };
};
