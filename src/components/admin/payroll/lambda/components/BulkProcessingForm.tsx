'use client';

import type { BulkProcessingFiles, ProcessingState } from '../types';
import HRMSModificationsWarning from '@/components/admin/payroll/HRMSModificationsWarning';
import { FormActionButtons, FormSection } from '@/components/admin/payroll/shared';
import React from 'react';
import { HiDocumentText, HiUsers } from 'react-icons/hi';
import { CSV_FILE_CONFIG, EXCEL_FILE_CONFIG } from '../utils/constants';
import FileUploadSection from './FileUploadSection';

type BulkProcessingFormProps = {
  bulkFiles: BulkProcessingFiles;
  processingState: ProcessingState;
  isFormDisabled: boolean;
  onSalariesFileUpload: (files: File[]) => void;
  onEmployeesFileUpload: (files: File[]) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
  onAcknowledgeWarning: () => void;
};

const BulkProcessingForm: React.FC<BulkProcessingFormProps> = ({
  bulkFiles,
  processingState,
  isFormDisabled,
  onSalariesFileUpload,
  onEmployeesFileUpload,
  onSubmit,
  onReset,
  onAcknowledgeWarning,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm md:p-6"
    >
      {/* Salaries File Upload */}
      <FormSection>
        <FileUploadSection
          title="Salaries File (Excel)"
          icon={<HiDocumentText className="size-4" />}
          description="Upload your salaries.xlsx file containing employee salary data"
          onDrop={onSalariesFileUpload}
          accept={EXCEL_FILE_CONFIG.accept}
          supportedFormats={EXCEL_FILE_CONFIG.supportedFormats}
          currentFile={bulkFiles.salariesFile || undefined}
          maxFiles={EXCEL_FILE_CONFIG.maxFiles}
          disabled={isFormDisabled}
        />
      </FormSection>

      {/* Employees File Upload */}
      <FormSection>
        <FileUploadSection
          title="Employees File (CSV)"
          icon={<HiUsers className="size-4" />}
          description="Upload your employees.csv file containing employee information"
          onDrop={onEmployeesFileUpload}
          accept={CSV_FILE_CONFIG.accept}
          supportedFormats={CSV_FILE_CONFIG.supportedFormats}
          currentFile={bulkFiles.employeesFile || undefined}
          maxFiles={CSV_FILE_CONFIG.maxFiles}
          disabled={isFormDisabled}
        />
      </FormSection>

      {/* HRMS Modifications Warning */}
      {processingState.showComparisonWarning && processingState.comparisonResult && (
        <HRMSModificationsWarning
          comparisonResult={processingState.comparisonResult}
          onAcknowledge={onAcknowledgeWarning}
        />
      )}

      {/* Action Buttons */}
      <FormActionButtons
        submitText="Upload Files"
        isFormDisabled={isFormDisabled}
        processingMessage={processingState.statusMessage}
        showReset={processingState.status !== 'idle'}
        onReset={onReset}
      />
    </form>
  );
};

export default BulkProcessingForm;
