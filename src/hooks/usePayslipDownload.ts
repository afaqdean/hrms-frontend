import { API } from '@/Interceptors/Interceptor';
import { useMutation } from '@tanstack/react-query';

export type PayslipDownloadResponse = {
  downloadUrl: string;
  exists: boolean;
  expiresAt: string;
  fileSize: number;
  version: number;
  pdfPassword: string;
};

export const usePayslipDownload = () => {
  const downloadMutation = useMutation({
    mutationFn: async ({
      employeeId,
      monthYear,
    }: {
      employeeId: string;
      monthYear: string;
    }): Promise<PayslipDownloadResponse | null> => {
      // Check if employeeId (CNIC) is provided
      if (!employeeId || employeeId.trim() === '') {
        throw new Error('Employee CNIC is required to download payslips');
      }

      const { data } = await API.get(
        `/lambda-payroll/payslips/${encodeURIComponent(employeeId)}/${encodeURIComponent(monthYear)}/download`,
      );

      if (data.exists) {
        return data;
      } else {
        throw new Error('Payslip not found for this period');
      }
    },
  });

  const downloadPayslip = async (
    employeeId: string,
    monthYear: string,
  ): Promise<PayslipDownloadResponse | null> => {
    return downloadMutation.mutateAsync({ employeeId, monthYear });
  };

  const triggerDownload = async (employeeId: string, monthYear: string) => {
    try {
      const result = await downloadMutation.mutateAsync({ employeeId, monthYear });

      if (result) {
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `Payslip_${employeeId}_${monthYear}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message with password
        return {
          success: true,
          password: result.pdfPassword,
          fileSize: result.fileSize,
          expiresAt: result.expiresAt,
        };
      }

      return { success: false };
    } catch {
      // Error is already handled by React Query
      return { success: false };
    }
  };

  return {
    downloadPayslip,
    triggerDownload,
    loading: downloadMutation.isPending,
    error: downloadMutation.error?.message || null,
  };
};
