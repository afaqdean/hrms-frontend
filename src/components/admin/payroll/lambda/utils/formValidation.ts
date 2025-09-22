import type { BulkProcessingFiles, FormValidationResult, IndividualProcessingData } from '../types';
import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from './constants';

/**
 * Validate employee ID (any non-empty string)
 * @param id - Employee ID to validate
 * @returns True if valid, false otherwise
 */
export const validateEmployeeId = (id: string): boolean => {
  return Boolean(id && id.trim().length > 0);
};

/**
 * Validate bulk processing form
 * @param files - Bulk processing files
 * @returns Validation result
 */
export const validateBulkForm = (files: BulkProcessingFiles): FormValidationResult => {
  if (!files.salariesFile) {
    toast.error(ERROR_MESSAGES.NO_SALARIES_FILE);
    return { isValid: false, errorMessage: ERROR_MESSAGES.NO_SALARIES_FILE };
  }

  if (!files.employeesFile) {
    toast.error(ERROR_MESSAGES.NO_EMPLOYEES_FILE);
    return { isValid: false, errorMessage: ERROR_MESSAGES.NO_EMPLOYEES_FILE };
  }

  return { isValid: true };
};

/**
 * Validate individual processing form
 * @param data - Individual processing data
 * @returns Validation result
 */
export const validateIndividualForm = (data: IndividualProcessingData): FormValidationResult => {
  if (!data.employeeId.trim()) {
    toast.error(ERROR_MESSAGES.NO_EMPLOYEE_ID);
    return { isValid: false, errorMessage: ERROR_MESSAGES.NO_EMPLOYEE_ID };
  }

  if (!validateEmployeeId(data.employeeId)) {
    toast.error(ERROR_MESSAGES.INVALID_EMPLOYEE_ID);
    return { isValid: false, errorMessage: ERROR_MESSAGES.INVALID_EMPLOYEE_ID };
  }

  if (!data.individualSalariesFile) {
    toast.error(ERROR_MESSAGES.NO_INDIVIDUAL_SALARIES);
    return { isValid: false, errorMessage: ERROR_MESSAGES.NO_INDIVIDUAL_SALARIES };
  }

  if (data.parsedSalariesData.length === 0) {
    toast.error(ERROR_MESSAGES.FILE_NOT_PROCESSED);
    return { isValid: false, errorMessage: ERROR_MESSAGES.FILE_NOT_PROCESSED };
  }

  return { isValid: true };
};
