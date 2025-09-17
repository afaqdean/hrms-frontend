import type {
  BulkProcessingFiles,
  ComparisonResult,
  IndividualProcessingData,
  ProcessingState,
  UploadStatus,
} from '../types';
import { useState } from 'react';

export const useLambdaPayrollState = () => {
  // Mode state
  const [isIndividualMode, setIsIndividualMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Default month for processing

  // Processing state
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    statusMessage: '',
    showProcessingModal: false,
    comparisonResult: null,
    showComparisonWarning: false,
  });

  // Bulk processing state
  const [bulkFiles, setBulkFiles] = useState<BulkProcessingFiles>({
    salariesFile: null,
    employeesFile: null,
    parsedSalariesData: [],
    parsedEmployeesData: [],
  });

  // Individual processing state
  const [individualData, setIndividualData] = useState<IndividualProcessingData>({
    employeeId: '',
    individualSalariesFile: null,
    parsedSalariesData: [],
  });

  // State update actions
  const updateProcessingState = (updates: Partial<ProcessingState>) => {
    setProcessingState(prev => ({ ...prev, ...updates }));
  };

  const updateBulkFiles = (updates: Partial<BulkProcessingFiles>) => {
    setBulkFiles(prev => ({ ...prev, ...updates }));
  };

  const updateIndividualData = (updates: Partial<IndividualProcessingData>) => {
    setIndividualData(prev => ({ ...prev, ...updates }));
  };

  const setStatus = (status: UploadStatus) => {
    updateProcessingState({ status });
  };

  const setStatusMessage = (statusMessage: string) => {
    updateProcessingState({ statusMessage });
  };

  const setShowProcessingModal = (showProcessingModal: boolean) => {
    updateProcessingState({ showProcessingModal });
  };

  const setComparisonResult = (comparisonResult: ComparisonResult | null) => {
    updateProcessingState({ comparisonResult });
  };

  const setShowComparisonWarning = (showComparisonWarning: boolean) => {
    updateProcessingState({ showComparisonWarning });
  };

  // Reset functions
  const resetForm = () => {
    setBulkFiles({
      salariesFile: null,
      employeesFile: null,
      parsedSalariesData: [],
      parsedEmployeesData: [],
    });
    setIndividualData({
      employeeId: '',
      individualSalariesFile: null,
      parsedSalariesData: [],
    });
    setProcessingState({
      status: 'idle',
      statusMessage: '',
      showProcessingModal: false,
      comparisonResult: null,
      showComparisonWarning: false,
    });
  };

  const resetBulkFiles = () => {
    setBulkFiles({
      salariesFile: null,
      employeesFile: null,
      parsedSalariesData: [],
      parsedEmployeesData: [],
    });
  };

  const resetIndividualData = () => {
    setIndividualData({
      employeeId: '',
      individualSalariesFile: null,
      parsedSalariesData: [],
    });
  };

  // Computed values
  const isFormDisabled = ['uploading', 'verifying', 'processing'].includes(processingState.status);

  return {
    // State
    isIndividualMode,
    selectedMonth,
    processingState,
    bulkFiles,
    individualData,

    // Actions
    setIsIndividualMode,
    setSelectedMonth,
    updateProcessingState,
    updateBulkFiles,
    updateIndividualData,
    setStatus,
    setStatusMessage,
    setShowProcessingModal,
    setComparisonResult,
    setShowComparisonWarning,

    // Reset functions
    resetForm,
    resetBulkFiles,
    resetIndividualData,

    // Computed values
    isFormDisabled,
  };
};
