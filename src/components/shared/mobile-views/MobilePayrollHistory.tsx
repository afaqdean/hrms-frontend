'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePayslipDownload } from '@/hooks/usePayslipDownload';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

// Mock data for demonstration - replace with actual data fetching
const mockPayrollData = [
  {
    id: 1,
    period: 'August 2025',
    basePay: 50000,
    bonuses: 5000,
    deductions: 2000,
    netPay: 53000,
  },
  {
    id: 2,
    period: 'July 2025',
    basePay: 50000,
    bonuses: 3000,
    deductions: 1500,
    netPay: 51500,
  },
  {
    id: 3,
    period: 'June 2025',
    basePay: 50000,
    bonuses: 2000,
    deductions: 1800,
    netPay: 50200,
  },
];

type MobilePayrollHistoryProps = {
  employeeId: string; // Used for API calls
  employeeCnic: string; // Used for payslip downloads
};

const MobilePayrollHistory = ({ employeeId: _employeeId, employeeCnic }: MobilePayrollHistoryProps) => {
  const { triggerDownload } = usePayslipDownload();
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');

  // Helper to convert period format for the API
  const formatMonthYear = (period: string): string => {
    if (!period || typeof period !== 'string') {
      return '';
    }

    // Extract month and year from "August 2025" format
    const parts = period.split(' ');
    if (parts.length !== 2) {
      return '';
    }

    const month = parts[0];
    const year = parts[1];

    return `${month}-${year}`;
  };

  // React Query mutation for payslip download
  const downloadMutation = useMutation({
    mutationFn: async (entry: any) => {
      if (!entry.period) {
        throw new Error('Invalid period format');
      }

      const monthYear = formatMonthYear(entry.period);
      if (!monthYear) {
        throw new Error('Could not format period for download');
      }

      // Use the actual employee CNIC passed as prop
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

  const handleDownloadPayslip = async (entry: any) => {
    downloadMutation.mutate(entry);
  };

  return (
    <div className="h-full rounded-lg md:hidden">
      {mockPayrollData.length > 0
        ? (
            <Accordion type="single" collapsible className="w-full">
              {mockPayrollData.map(entry => (
                <AccordionItem className="my-3 rounded-lg bg-white" key={entry.id} value={entry.id.toString()}>
                  <AccordionTrigger className="flex w-full items-center justify-between rounded-lg border p-4 no-underline">
                    <div className="flex w-full items-center gap-2">
                      <span className="rounded-full bg-[#E3EEFF] px-4 py-2 text-xs text-primary-100">
                        {entry.period}
                      </span>
                      <span className="rounded-full bg-light-success px-4 py-2 text-xs font-semibold text-[#177B1B]">
                        $
                        {entry.netPay.toLocaleString()}
                      </span>
                      <span className="rounded-full bg-secondary-100 px-4 py-2 text-xs text-primary-100">
                        $
                        {entry.basePay.toLocaleString()}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-normal text-primary-100">Bonuses:</span>
                        <span className="rounded-full bg-[#E3EEFF] px-4 py-2 text-primary-100">
                          $
                          {entry.bonuses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-normal text-primary-100">Deductions:</span>
                        <span className="rounded-full bg-light-danger px-4 py-2 text-danger">
                          -$
                          {entry.deductions.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        className="my-4 flex w-full items-center justify-center gap-2"
                        onClick={() => handleDownloadPayslip(entry)}
                        disabled={downloadMutation.isPending}
                      >
                        {downloadMutation.isPending
                          ? (
                              <>
                                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Downloading...
                              </>
                            )
                          : (
                              <>
                                Download Payslip
                              </>
                            )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )
        : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-gray-500">No payroll data available</p>
            </div>
          )}

      {/* Password Popup */}
      <Dialog open={showPasswordPopup} onOpenChange={setShowPasswordPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payslip Downloaded Successfully!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your payslip has been downloaded. Please use the following password to open the PDF:
            </p>
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-center font-mono text-lg font-bold text-gray-800">
                {pdfPassword}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Note: Keep this password safe. You'll need it to open the payslip PDF file.
            </p>
            <Button
              onClick={() => setShowPasswordPopup(false)}
              className="w-full"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobilePayrollHistory;
