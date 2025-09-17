import type { Payslip } from '@/interfaces/Payslip';
import PasswordPopup from '@/components/ui/PasswordPopup';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { usePayrollTableData } from './hooks/usePayrollTableData';
import { usePayslipDownloader } from './hooks/usePayslipDownloader';
import { PayrollTableRow } from './PayrollTableRow';
import { PayrollTableStates } from './PayrollTableStates';

/**
 * Props for PayrollHistoryTable component
 */
export type PayrollHistoryTableProps = {
  employeeId: string; // Used for MongoDB queries (payslip display)
  employeeCnic: string; // Used for payslip downloads
  selectedMonth: Date;
};

/**
 * Main PayrollHistoryTable component
 * Displays employee payroll history in a responsive table format
 */
const PayrollHistoryTable: React.FC<PayrollHistoryTableProps> = ({
  employeeId,
  employeeCnic,
  selectedMonth,
}) => {
  // Data management hook
  const {
    filteredPayslips,
    isLoading,
    isError,
    error,
    showTimeout,
    handleRetry,
    handleBypassLoading,
    handleRefreshPage,
  } = usePayrollTableData(employeeId, selectedMonth);

  // Download management hook
  const {
    showPasswordPopup,
    pdfPassword,
    isDownloading,
    handleDownloadPayslip,
    handleClosePasswordPopup,
  } = usePayslipDownloader(employeeCnic);

  // Determine if we should show states or data
  const showStates = isLoading || isError || filteredPayslips.length === 0;

  return (
    <div className="scrollbar hidden size-full overflow-y-scroll rounded-2xl bg-white p-6 shadow-md md:block">
      <Table>
        {/* Table Header */}
        <TableHeader className="custom-table-header sticky top-0 z-10">
          <TableRow>
            <TableCell className="w-40 px-6 py-4 text-center">Payroll Period</TableCell>
            <TableCell className="w-40 px-6 py-4 text-center">Net Pay</TableCell>
            <TableCell className="w-40 px-6 py-4 text-center">Base Pay</TableCell>
            <TableCell className="w-40 px-6 py-4 text-center">Bonuses</TableCell>
            <TableCell className="w-40 px-6 py-4 text-center">Total Deductions</TableCell>
            <TableCell className="w-40 px-6 py-4 text-center">Download Payslip</TableCell>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {showStates
            ? (
                <PayrollTableStates
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  isEmpty={filteredPayslips.length === 0}
                  showTimeout={showTimeout}
                  onRetry={handleRetry}
                  onBypassLoading={handleBypassLoading}
                  onRefreshPage={handleRefreshPage}
                />
              )
            : (
                filteredPayslips.map((payslip: Payslip) => (
                  <PayrollTableRow
                    key={payslip.id || payslip._id}
                    payslip={payslip}
                    isDownloading={isDownloading}
                    onDownload={handleDownloadPayslip}
                  />
                ))
              )}
        </TableBody>
      </Table>

      {/* Password Popup */}
      <PasswordPopup
        isOpen={showPasswordPopup}
        onClose={handleClosePasswordPopup}
        password={pdfPassword}
        title="PDF Password"
      />
    </div>
  );
};

export default PayrollHistoryTable;
