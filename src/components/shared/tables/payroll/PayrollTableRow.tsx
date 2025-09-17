import type { Payslip } from '@/interfaces/Payslip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/payrollUtils';
import { Download } from 'lucide-react';
import React from 'react';

/**
 * Props for PayrollTableRow component
 */
type PayrollTableRowProps = {
  payslip: Payslip;
  isDownloading: boolean;
  onDownload: (payslip: Payslip) => void;
};

/**
 * Individual row component for payroll table
 * Renders a single payslip entry with download functionality
 */
export const PayrollTableRow: React.FC<PayrollTableRowProps> = ({
  payslip,
  isDownloading,
  onDownload,
}) => {
  return (
    <TableRow key={payslip.id || payslip._id} className="border-b">
      {/* Payroll Period */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <span className="flex w-full justify-center rounded-full bg-[#E3EEFF] px-4 py-3 text-primary-100">
          {payslip.period}
        </span>
      </TableCell>

      {/* Net Pay */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <span className="text-base font-semibold text-green-700">
          PKR
          {' '}
          {formatCurrency(payslip.netPay)}
        </span>
      </TableCell>

      {/* Base Pay */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <span className="text-base font-semibold text-gray-900">
          PKR
          {' '}
          {formatCurrency(payslip.basePay)}
        </span>
      </TableCell>

      {/* Bonuses */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <span className="text-base font-semibold text-blue-600">
          PKR
          {' '}
          {formatCurrency(payslip.bonuses)}
        </span>
      </TableCell>

      {/* Total Deductions */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <span className="text-base font-semibold text-red-600">
          -PKR
          {' '}
          {formatCurrency(payslip.deductions)}
        </span>
      </TableCell>

      {/* Download Payslip */}
      <TableCell className="w-40 px-6 py-4 text-center">
        <div className="flex w-full items-center justify-center">
          <Button
            onClick={() => onDownload(payslip)}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-primary-100 text-white hover:bg-primary-100/90"
            size="sm"
          >
            {isDownloading
              ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )
              : (
                  <Download className="size-4" />
                )}
            Download
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
