import type {
  CreateSalaryIncrementPayload,
  SalaryChangeLogEntry,
  SalaryIncrement,
  UpdateSalaryIncrementPayload,
} from '@/interfaces/SalaryIncrement';
import { API } from '@/Interceptors/Interceptor';

/**
 * Salary Increment Service
 * Handles all salary increment related API calls using the actual HRMS endpoints
 */

// Create a new salary increment for an employee
export const createSalaryIncrement = async (
  employeeId: string,
  payload: CreateSalaryIncrementPayload,
): Promise<SalaryIncrement> => {
  const response = await API.post(`/salary-increments/${employeeId}`, payload);
  return response.data;
};

// Update an existing salary increment
export const updateSalaryIncrement = async (
  incrementId: string,
  payload: UpdateSalaryIncrementPayload,
): Promise<SalaryIncrement> => {
  const response = await API.patch(`/salary-increments/${incrementId}`, payload);
  return response.data;
};

// Delete a salary increment (soft delete)
export const deleteSalaryIncrement = async (
  incrementId: string,
): Promise<{ message: string }> => {
  const response = await API.delete(`/salary-increments/${incrementId}`);
  return response.data;
};

// Get all salary increments for a specific employee
export const getEmployeeSalaryIncrements = async (
  employeeId: string,
): Promise<SalaryIncrement[]> => {
  const response = await API.get(`/salary-increments/${employeeId}`);
  return response.data;
};

// Get salary change log for an employee (CORRECTED ENDPOINT)
export const getEmployeeSalaryChangeLog = async (
  employeeId: string,
): Promise<SalaryChangeLogEntry[]> => {
  try {
    const response = await API.get(`/payroll/salary-change-log/${employeeId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching salary change log:', error);
    // Return empty array if there's an error, but log it for debugging
    return [];
  }
};

// Get employee details by ID (Admin only)
export const getEmployeeById = async (employeeId: string): Promise<{
  _id: string;
  name: string;
  email: string;
  salary: number;
  employeeID: string;
  position?: string;
  profileImage?: string;
  // ... other employee fields
}> => {
  const response = await API.get(`/admin/employee/${employeeId}`);
  return response.data;
};

// Update employee's base salary (separate from increments)
export const updateEmployeeBaseSalary = async (
  employeeId: string,
  newSalary: number,
): Promise<{ message: string; salary: number }> => {
  const response = await API.patch(`/user/${employeeId}/salary`, { salary: newSalary });
  return response.data;
};

// Get salary increments by period
export const getSalaryIncrementsByPeriod = async (
  period: string,
): Promise<SalaryIncrement[]> => {
  const response = await API.get(`/salary-increments/period/${period}`);
  return response.data;
};

// Get all salary increments across all employees (admin only)
export const getAllSalaryIncrements = async (): Promise<SalaryIncrement[]> => {
  const response = await API.get('/salary-increments');
  return response.data;
};

// Bulk operations for salary increments
export const bulkCreateSalaryIncrements = async (
  increments: Array<{ employeeId: string; payload: CreateSalaryIncrementPayload }>,
): Promise<Array<{ success: boolean; data?: SalaryIncrement; error?: string }>> => {
  const promises = increments.map(async ({ employeeId, payload }) => {
    try {
      const data = await createSalaryIncrement(employeeId, payload);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || 'Failed to create increment',
      };
    }
  });

  return Promise.all(promises);
};

// Utility function to extract array from response (handles different response structures)
export const extractArrayFromResponse = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data && data.results && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
};

// Export all functions as a service object for easier imports
export const salaryIncrementService = {
  createSalaryIncrement,
  updateSalaryIncrement,
  deleteSalaryIncrement,
  getEmployeeById,
  getEmployeeSalaryIncrements,
  getEmployeeSalaryChangeLog,
  updateEmployeeBaseSalary,
  getSalaryIncrementsByPeriod,
  getAllSalaryIncrements,
  bulkCreateSalaryIncrements,
  extractArrayFromResponse,
};
