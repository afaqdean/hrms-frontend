import type { SalaryData } from '../types';
import { processExcelFile } from '@/hooks/useProcessFile';
import { toast } from 'react-toastify';
import { STATUS_MESSAGES, TOAST_MESSAGES } from '../utils/constants';

export const useFileProcessing = () => {
  /**
   * Process Excel file and return parsed data
   * @param file - The Excel file to process
   * @returns Promise with parsed data
   */
  const processFile = async (file: File): Promise<SalaryData[]> => {
    return new Promise<SalaryData[]>((resolve, reject) => {
      processExcelFile(
        file,
        data => resolve(data),
        error => reject(error),
      );
    });
  };

  /**
   * Handle file upload with processing and success feedback
   * @param file - The file to process
   * @param onStatusUpdate - Callback for status updates
   * @param onSuccess - Callback for successful processing
   * @param onError - Callback for error handling
   */
  const handleFileUpload = async (
    file: File,
    onStatusUpdate: (message: string) => void,
    onSuccess: (data: SalaryData[], file: File) => void,
    onError: (error: string) => void,
  ) => {
    if (!file) {
      return;
    }

    try {
      onStatusUpdate(STATUS_MESSAGES.PROCESSING_FILE);

      const data = await processFile(file);

      onStatusUpdate(STATUS_MESSAGES.FILE_PROCESSED);
      toast.success(TOAST_MESSAGES.FILE_SUCCESS);

      onSuccess(data, file);
    } catch (error: unknown) {
      const errorMessage = `Error processing salaries file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onStatusUpdate(errorMessage);
      toast.error(errorMessage);
      onError(errorMessage);
    }
  };

  /**
   * Handle bulk salaries file upload
   * @param files - Array of files (expects single file)
   * @param onStatusUpdate - Status update callback
   * @param onDataUpdate - Data update callback
   * @param onFileUpdate - File update callback
   * @param onError - Error callback
   */
  const handleBulkSalariesFile = async (
    files: File[],
    onStatusUpdate: (message: string) => void,
    onDataUpdate: (data: SalaryData[]) => void,
    onFileUpdate: (file: File) => void,
    onError: (error: string) => void,
  ) => {
    const file = files[0];
    if (!file) {
      return;
    }

    onFileUpdate(file);

    await handleFileUpload(
      file,
      onStatusUpdate,
      (data) => {
        onDataUpdate(data);
      },
      onError,
    );
  };

  /**
   * Handle individual salaries file upload
   * @param files - Array of files (expects single file)
   * @param onStatusUpdate - Status update callback
   * @param onDataUpdate - Data update callback
   * @param onFileUpdate - File update callback
   * @param onError - Error callback
   */
  const handleIndividualSalariesFile = async (
    files: File[],
    onStatusUpdate: (message: string) => void,
    onDataUpdate: (data: SalaryData[]) => void,
    onFileUpdate: (file: File) => void,
    onError: (error: string) => void,
  ) => {
    const file = files[0];
    if (!file) {
      return;
    }

    onFileUpdate(file);

    await handleFileUpload(
      file,
      onStatusUpdate,
      (data) => {
        onDataUpdate(data);
      },
      onError,
    );
  };

  return {
    processFile,
    handleFileUpload,
    handleBulkSalariesFile,
    handleIndividualSalariesFile,
  };
};
