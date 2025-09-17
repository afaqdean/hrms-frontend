import type { Payslip } from '@/interfaces/Payslip';
import { usePayslipDownload } from '@/hooks/usePayslipDownload';
import { formatMonthYear } from '@/utils/payrollUtils';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing payslip downloads and password popup
 */
export const usePayslipDownloader = (employeeCnic: string) => {
  const { triggerDownload } = usePayslipDownload();
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');

  // React Query mutation for payslip download
  const downloadMutation = useMutation({
    mutationFn: async (entry: Payslip) => {
      if (!entry.period) {
        throw new Error('Invalid period format');
      }

      const monthYear = formatMonthYear(entry.period);
      if (!monthYear) {
        throw new Error('Could not format period for download');
      }

      const result = await triggerDownload(employeeCnic, monthYear);

      if (result?.success) {
        return result;
      } else {
        throw new Error('Failed to download payslip');
      }
    },
    onSuccess: (result) => {
      setPdfPassword(result.password || '');
      setShowPasswordPopup(true);
      toast.success('Payslip downloaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error downloading payslip');
    },
  });

  const handleDownloadPayslip = async (entry: Payslip) => {
    downloadMutation.mutate(entry);
  };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
  };

  return {
    showPasswordPopup,
    pdfPassword,
    isDownloading: downloadMutation.isPending,
    handleDownloadPayslip,
    handleClosePasswordPopup,
  };
};
