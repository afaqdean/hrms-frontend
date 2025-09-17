'use client';

import type { IndividualProcessingData, ProcessingState } from '../types';
import HRMSModificationsWarning from '@/components/admin/payroll/HRMSModificationsWarning';
import { FormActionButtons, FormSection } from '@/components/admin/payroll/shared';
import { Input } from '@/components/ui/input';
import React from 'react';
import { HiDocumentText, HiUser } from 'react-icons/hi';
import { EXCEL_FILE_CONFIG } from '../utils/constants';
import { validateEmployeeId } from '../utils/formValidation';
import EmployeeDataPreview from './EmployeeDataPreview';
import FileUploadSection from './FileUploadSection';

type IndividualProcessingFormProps = {
  individualData: IndividualProcessingData;
  processingState: ProcessingState;
  isFormDisabled: boolean;
  onEmployeeIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSalariesFileUpload: (files: File[]) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
  onAcknowledgeWarning: () => void;
};

const IndividualProcessingForm: React.FC<IndividualProcessingFormProps> = ({
  individualData,
  processingState,
  isFormDisabled,
  onEmployeeIdChange,
  onSalariesFileUpload,
  onSubmit,
  onReset,
  onAcknowledgeWarning,
}) => {
  const showEmployeePreview
    = individualData.employeeId
    && individualData.parsedSalariesData.length > 0
    && validateEmployeeId(individualData.employeeId);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm md:p-6"
    >
      {/* Employee ID */}
      <FormSection>
        <div className="flex items-center gap-2 text-sm font-medium text-secondary-300">
          <HiUser className="size-4" />
          Employee ID (CNIC) *
        </div>
        <Input
          type="text"
          placeholder="37405-1234567-1"
          value={individualData.employeeId}
          onChange={onEmployeeIdChange}
          className={`${
            validateEmployeeId(individualData.employeeId) || !individualData.employeeId
              ? 'border-secondary-200'
              : 'border-danger'
          }`}
          disabled={isFormDisabled}
        />
        <p className="text-xs text-secondary-300">
          Enter employee CNIC in format: 37405-1234567-1
        </p>
      </FormSection>

      {/* Salaries File Upload */}
      <FormSection>
        <FileUploadSection
          title="Salaries File (Excel) *"
          icon={<HiDocumentText className="size-4" />}
          description="Upload salaries.xlsx file containing all employee data (Employee ID, name, salary details, etc.)"
          onDrop={onSalariesFileUpload}
          accept={EXCEL_FILE_CONFIG.accept}
          supportedFormats={EXCEL_FILE_CONFIG.supportedFormats}
          currentFile={individualData.individualSalariesFile || undefined}
          maxFiles={EXCEL_FILE_CONFIG.maxFiles}
          disabled={isFormDisabled}
        />

        {individualData.parsedSalariesData.length > 0 && (
          <p className="text-xs text-green-600">
            ✅
            {' '}
            {individualData.parsedSalariesData.length}
            {' '}
            salary records loaded
          </p>
        )}
      </FormSection>

      {/* Employee Data Preview */}
      {showEmployeePreview && (
        <EmployeeDataPreview
          employeeId={individualData.employeeId}
          parsedSalariesData={individualData.parsedSalariesData}
          parsedEmployeesData={[]} // Individual mode doesn't use employee CSV
          isVisible
        />
      )}

      {/* HRMS Modifications Warning */}
      {processingState.showComparisonWarning && processingState.comparisonResult && (
        <HRMSModificationsWarning
          comparisonResult={processingState.comparisonResult}
          onAcknowledge={onAcknowledgeWarning}
        />
      )}

      {/* Action Buttons */}
      <FormActionButtons
        submitText="Process Individual Payroll"
        isFormDisabled={isFormDisabled}
        processingMessage={processingState.statusMessage}
        showReset={processingState.status !== 'idle'}
        onReset={onReset}
      />
    </form>
  );
};

export default IndividualProcessingForm;
