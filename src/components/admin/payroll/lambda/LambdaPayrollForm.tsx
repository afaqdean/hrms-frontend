'use client';

import type { IndividualProcessingRequest } from '@/hooks/useLambdaPayroll';
import ProcessingModal from '@/components/admin/payroll/lambda/ProcessingModal';
import StatusIndicator from '@/components/admin/payroll/lambda/StatusIndicator';
import { useExcelUpload } from '@/hooks/useExcelUpload';
import { useLambdaPayroll } from '@/hooks/useLambdaPayroll';
import { findEmployeeInFiles } from '@/hooks/useProcessFile';
import React from 'react';
import { toast } from 'react-toastify';

import BulkProcessingForm from './components/BulkProcessingForm';
import HowItWorksSection from './components/HowItWorksSection';
import IndividualProcessingForm from './components/IndividualProcessingForm';
import ModeToggle from './components/ModeToggle';
import MonthPicker from './components/MonthPicker';
import { useFileProcessing } from './hooks/useFileProcessing';
import { useHRMSValidation } from './hooks/useHRMSValidation';
import { useLambdaPayrollState } from './hooks/useLambdaPayrollState';
import { ERROR_MESSAGES, STATUS_MESSAGES, TOAST_MESSAGES } from './utils/constants';
import {
  calculatePaymentDate,
  formatMonthYear,
  formatMonthYearForProcessing,
  formatPeriodString,
} from './utils/dateUtils';
import { validateBulkForm, validateIndividualForm } from './utils/formValidation';

const LambdaPayrollForm: React.FC = () => {
  // State management with custom hooks
  const {
    isIndividualMode,
    selectedMonth,
    processingState,
    bulkFiles,
    individualData,
    setIsIndividualMode,
    setSelectedMonth,
    updateBulkFiles,
    updateIndividualData,
    setStatus,
    setStatusMessage,
    setShowProcessingModal,
    setComparisonResult,
    setShowComparisonWarning,
    resetForm,
    isFormDisabled,
  } = useLambdaPayrollState();

  // External hooks
  const {
    uploadFiles,
    verifyUpload,
    triggerBulkProcessing,
    processIndividualPayroll,
    error,
  } = useLambdaPayroll();

  const { uploadExcel } = useExcelUpload();

  // File processing and HRMS validation hooks
  const { handleBulkSalariesFile, handleIndividualSalariesFile } = useFileProcessing();
  const { handleHRMSValidation } = useHRMSValidation();

  // Event handlers

  // Handle bulk salaries file upload and HRMS check
  const handleBulkSalariesFileUpload = async (files: File[]) => {
    setStatus('uploading');

    await handleBulkSalariesFile(
      files,
      setStatusMessage,
      data => updateBulkFiles({ parsedSalariesData: data }),
      file => updateBulkFiles({ salariesFile: file }),
      () => setStatus('error'),
    );

    // After file processing, check HRMS modifications
    if (files[0]) {
      await handleHRMSValidation(
        selectedMonth,
        setComparisonResult,
        setShowComparisonWarning,
        setStatusMessage,
      );
    }

    setStatus('idle');
  };

  // Handle employee ID change and re-check HRMS modifications
  const handleEmployeeIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmployeeId = e.target.value;
    updateIndividualData({ employeeId: newEmployeeId });

    // If we have both employee ID and parsed salaries data, check for HRMS modifications
    if (newEmployeeId && newEmployeeId.match(/^\d{5}-\d{7}-\d$/) && individualData.parsedSalariesData.length > 0) {
      await handleHRMSValidation(
        selectedMonth,
        setComparisonResult,
        setShowComparisonWarning,
        setStatusMessage,
      );
    }
  };

  // Handle individual file uploads and parsing
  const handleIndividualSalariesFileUpload = async (files: File[]) => {
    setStatus('uploading');
    await handleIndividualSalariesFile(
      files,
      setStatusMessage,
      data => updateIndividualData({ parsedSalariesData: data }),
      file => updateIndividualData({ individualSalariesFile: file }),
      () => setStatus('error'),
    );

    // After file processing, check HRMS modifications
    if (files[0]) {
      await handleHRMSValidation(
        selectedMonth,
        setComparisonResult,
        setShowComparisonWarning,
        setStatusMessage,
      );
    }

    setStatus('idle');
  };

  // Mode switching with data confirmation
  const handleModeChange = (isIndividual: boolean) => {
    setIsIndividualMode(isIndividual);
    resetForm();
  };

  // Check if form has data for mode switching confirmation
  const hasFormData = () => {
    return !!(
      bulkFiles.salariesFile
      || bulkFiles.employeesFile
      || individualData.employeeId
      || individualData.individualSalariesFile
      || individualData.parsedSalariesData.length > 0
    );
  };

  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateBulkForm(bulkFiles);
    if (!validation.isValid) {
      return;
    }

    try {
      setStatus('uploading');
      setStatusMessage(STATUS_MESSAGES.UPLOADING_FILES);

      // Upload both files through backend endpoint
      const monthYear = formatMonthYearForProcessing(selectedMonth);
      const uploadSuccess = await uploadFiles(bulkFiles.salariesFile!, bulkFiles.employeesFile!, monthYear);

      if (!uploadSuccess) {
        throw new Error(ERROR_MESSAGES.UPLOAD_FAILED);
      }

      // Wait a moment for S3 to register files
      setStatus('verifying');
      setStatusMessage(STATUS_MESSAGES.VERIFYING_UPLOADS);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify both uploads
      const monthYearFormatted = formatMonthYearForProcessing(selectedMonth);
      const [salariesVerified, employeesVerified] = await Promise.all([
        verifyUpload('salaries', monthYearFormatted),
        verifyUpload('employees', monthYearFormatted),
      ]);

      if (!salariesVerified?.fileExists || !employeesVerified?.fileExists) {
        throw new Error(
          `${ERROR_MESSAGES.VERIFICATION_FAILED} - Salaries: ${salariesVerified?.fileExists ? '✅' : '❌'}, Employees: ${employeesVerified?.fileExists ? '✅' : '❌'}`,
        );
      }

      setStatusMessage(STATUS_MESSAGES.FILES_VERIFIED);
      setStatus('ready');
      setShowProcessingModal(true);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      setStatus('error');
      const errorMessage = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
            ? String(err.response.data.message)
            : 'Upload failed');
      setStatusMessage(`Upload failed: ${errorMessage}`);
      toast.error(`Upload failed: ${errorMessage}`);
    }
  };

  const handleExcelUpload = async (isIndividual: boolean = false) => {
    // Both modes use the same Excel file (with all employees) for payslip generation
    // Prioritize the file that's actually available for the current mode
    const file = isIndividual
      ? (individualData.individualSalariesFile || bulkFiles.salariesFile)
      : (bulkFiles.salariesFile || individualData.individualSalariesFile);
    const processingType = isIndividual ? 'individual' : 'bulk';

    if (!file) {
      throw new Error(`No salaries file available for payslip generation`);
    }

    try {
      const periodStr = formatPeriodString(selectedMonth);
      // Auto-calculate payment date
      const paymentDate = calculatePaymentDate(selectedMonth);

      setStatusMessage(STATUS_MESSAGES.GENERATING_PAYSLIPS);

      console.warn(`Starting ${processingType} Excel upload for payslip generation:`, {
        file: file.name,
        period: periodStr,
        paymentDate,
      });

      const result = await uploadExcel(file, periodStr);

      // Check for success - could be result.data.success === true OR a success message
      const isSuccess = result?.data && (
        result.data.success === true
        || (result.message && result.message.toLowerCase().includes('successfully'))
        || (result.message && result.message.toLowerCase().includes('completed'))
      );

      if (isSuccess) {
        setStatus('completed');
        setStatusMessage(
          `Complete! ${processingType.charAt(0).toUpperCase() + processingType.slice(1)} processing and ${result.data.summary.processedSuccessfully} payslips generated for ${result.data.payslips[0]?.period || 'the period'}.`,
        );
        toast.success(
          `All done! ${processingType.charAt(0).toUpperCase() + processingType.slice(1)} processing completed and ${result.data.summary.processedSuccessfully} payslips generated successfully!`,
        );

        // Reset form after a delay
        setTimeout(() => {
          resetForm();
        }, 5000);
      } else {
        throw new Error(ERROR_MESSAGES.EXCEL_UPLOAD_FAILED);
      }
    } catch (err: unknown) {
      console.error(`${processingType.charAt(0).toUpperCase() + processingType.slice(1)} Excel upload error:`, err);
      setStatus('error');
      const errorMessage = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
            ? String(err.response.data.message)
            : 'Excel upload failed');
      setStatusMessage(`${ERROR_MESSAGES.PAYSLIP_GENERATION_FAILED}: ${errorMessage}`);
      toast.error(`${ERROR_MESSAGES.PAYSLIP_GENERATION_FAILED}: ${errorMessage}`);
    }
  };

  const handleBulkProcessing = async () => {
    try {
      setShowProcessingModal(false);
      setStatus('processing');
      setStatusMessage(STATUS_MESSAGES.TRIGGERING_BULK);

      const monthYearFormatted = formatMonthYearForProcessing(selectedMonth);
      const result = await triggerBulkProcessing(monthYearFormatted, 'all');

      if (result?.triggered) {
        setStatus('processing');
        setStatusMessage(STATUS_MESSAGES.BULK_STARTED);
        toast.success(TOAST_MESSAGES.BULK_SUCCESS);

        // Automatically trigger Excel upload for payslip generation
        await handleExcelUpload(false);
      } else {
        throw new Error(ERROR_MESSAGES.BULK_PROCESSING_FAILED);
      }
    } catch (err: unknown) {
      console.error('Bulk processing error:', err);
      setStatus('error');
      const errorMessage = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
            ? String(err.response.data.message)
            : 'Bulk processing failed');
      setStatusMessage(`${ERROR_MESSAGES.BULK_PROCESSING_FAILED}: ${errorMessage}`);
      toast.error(`${ERROR_MESSAGES.BULK_PROCESSING_FAILED}: ${errorMessage}`);
    }
  };

  const handleIndividualProcessing = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateIndividualForm(individualData);
    if (!validation.isValid) {
      return;
    }

    try {
      setStatus('processing');
      setStatusMessage(STATUS_MESSAGES.EXTRACTING_EMPLOYEE_DATA);

      // Find employee data in the parsed files
      const { salaryData, error, debugInfo } = findEmployeeInFiles(
        individualData.employeeId,
        individualData.parsedSalariesData,
        [], // Individual mode doesn't use employee CSV
      );

      if (error) {
        if (debugInfo) {
          console.error('Debug info:', debugInfo);
          const debugMessage = `${error}\n\nAvailable columns: ${debugInfo.availableColumns?.join(', ')}\n\nSample data: ${debugInfo.sampleIds?.join(' | ')}`;
          throw new Error(debugMessage);
        }
        throw new Error(error);
      }

      setStatusMessage(STATUS_MESSAGES.PROCESSING_INDIVIDUAL);

      // Map the salary data to the expected format using exact column names from Excel structure
      const processingData: IndividualProcessingRequest = {
        monthYear: formatMonthYearForProcessing(selectedMonth),
        name: salaryData?.Name,
        basicSalary: salaryData?.['Basic Salary'],
        medicalAllowance: salaryData?.['Medical Allowance'],
        bonus: salaryData?.Bonus,
        grossSalary: salaryData?.['Gross Salary'],
        salaryTax: salaryData?.['Salary tax'], // Note: lowercase 't' in 'tax' as per Python script
        salaryPayable: salaryData?.['Salary Payable'],
        deductionTripInsurance: salaryData?.['Trip/Insurance'], // Updated to match Excel structure
        deductionAdvanceSalary: salaryData?.['Advance salary Deduction'], // Updated to match Excel structure
      };

      console.warn('=== INDIVIDUAL PROCESSING REQUEST ===');
      console.warn('Employee ID:', individualData.employeeId);
      console.warn('Sending individual processing request with data:', processingData);
      console.warn('=======================================');

      const result = await processIndividualPayroll(individualData.employeeId, processingData);

      console.warn('=== INDIVIDUAL PROCESSING RESPONSE ===');
      console.warn('Full result object:', result);
      console.warn('Success:', result?.success);
      console.warn('Message:', result?.message);
      console.warn('=====================================');

      // Check for success - could be result.success === true OR a success message
      const isSuccess
        = result?.success === true
        || (result?.message && result.message.toLowerCase().includes('completed'))
        || (result?.message && result.message.toLowerCase().includes('success'));

      if (isSuccess) {
        console.warn('✅ Individual processing SUCCESS!');
        setStatus('processing');
        setStatusMessage(STATUS_MESSAGES.INDIVIDUAL_PROCESSED);
        toast.success(TOAST_MESSAGES.INDIVIDUAL_SUCCESS);

        // Automatically trigger Excel upload for payslip generation
        try {
          await handleExcelUpload(true);
        } catch (err: unknown) {
          console.error('Individual Excel upload error:', err);
          setStatus('error');
          const errorMessage = err instanceof Error
            ? err.message
            : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
                ? String(err.response.data.message)
                : 'Excel upload failed');
          setStatusMessage(`${ERROR_MESSAGES.PAYSLIP_GENERATION_FAILED}: ${errorMessage}`);
          toast.error(`${ERROR_MESSAGES.PAYSLIP_GENERATION_FAILED}: ${errorMessage}`);
        }
      } else {
        console.error('❌ Individual processing FAILED!');
        const errorMessage = result?.message || ERROR_MESSAGES.INDIVIDUAL_PROCESSING_FAILED;
        throw new Error(errorMessage);
      }
    } catch (err: unknown) {
      console.error('=== INDIVIDUAL PROCESSING ERROR ===');
      console.error('Error object:', err);
      console.error('==================================');

      let errorMessage: string = ERROR_MESSAGES.INDIVIDUAL_PROCESSING_FAILED;

      // Try to extract detailed error message using type guards
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        errorMessage = String(err.response.data.message);
      } else if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
        errorMessage = String(err.response.data.error);
      } else if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }

      setStatus('error');
      setStatusMessage(`${ERROR_MESSAGES.INDIVIDUAL_PROCESSING_FAILED}: ${errorMessage}`);
      toast.error(`${ERROR_MESSAGES.INDIVIDUAL_PROCESSING_FAILED}: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <StatusIndicator status={processingState.status} message={processingState.statusMessage} />

      {/* Month Picker */}
      <MonthPicker
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* Mode Toggle */}
      <ModeToggle
        isIndividualMode={isIndividualMode}
        onModeChange={handleModeChange}
        disabled={isFormDisabled}
        hasData={hasFormData()}
      />

      {/* Bulk Processing Form */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          !isIndividualMode
            ? 'max-h-[2000px] translate-y-0 opacity-100'
            : 'pointer-events-none max-h-0 -translate-y-4 overflow-hidden opacity-0'
        }`}
      >
        {!isIndividualMode && (
          <BulkProcessingForm
            bulkFiles={bulkFiles}
            processingState={processingState}
            isFormDisabled={isFormDisabled}
            onSalariesFileUpload={handleBulkSalariesFileUpload}
            onEmployeesFileUpload={files => updateBulkFiles({ employeesFile: files[0] || null })}
            onSubmit={handleFileUpload}
            onReset={resetForm}
            onAcknowledgeWarning={() => setShowComparisonWarning(false)}
          />
        )}
      </div>

      {/* Individual Processing Form */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isIndividualMode
            ? 'max-h-[2000px] translate-y-0 opacity-100'
            : 'pointer-events-none max-h-0 -translate-y-4 overflow-hidden opacity-0'
        }`}
      >
        {isIndividualMode && (
          <IndividualProcessingForm
            individualData={individualData}
            processingState={processingState}
            isFormDisabled={isFormDisabled}
            onEmployeeIdChange={handleEmployeeIdChange}
            onSalariesFileUpload={handleIndividualSalariesFileUpload}
            onSubmit={handleIndividualProcessing}
            onReset={resetForm}
            onAcknowledgeWarning={() => setShowComparisonWarning(false)}
          />
        )}
      </div>

      {/* Processing Modal (for bulk processing only) */}
      {processingState.showProcessingModal && !isIndividualMode && (
        <ProcessingModal
          monthYear={formatMonthYear(selectedMonth)}
          onConfirm={handleBulkProcessing}
          onCancel={() => setShowProcessingModal(false)}
          isOpen={processingState.showProcessingModal}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-2xl border border-danger bg-light-danger p-4 text-danger">
          <div className="flex items-start">
            <span className="mr-2 text-lg">❌</span>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Error:</h4>
              <p className="mt-1 text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <HowItWorksSection isIndividualMode={isIndividualMode} />
    </div>
  );
};

export default LambdaPayrollForm;
