// Export all hooks
export { useAuthGuard } from './useAuthGuard';

export { useBonuses } from './useBonuses';
export { useChangePassword } from './useChangePassword';
export { useConversation } from './useConversation';

export { useConversationMessages } from './useConversationMessages';
export { useCreateBonus } from './useCreateBonus';
export { useCreateDeduction } from './useCreateDeduction';
export { useDeductions } from './useDeductions';
export { useDeleteBonus } from './useDeleteBonus';
export { useDeleteDeduction } from './useDeleteDeduction';
// Default exports
export { default as useEmployees } from './useEmployees';
export { useExcelUpload } from './useExcelUpload';
export { useFetchAttendance } from './useFetchAttendance';
export { useLambdaPayroll } from './useLambdaPayroll';
export { useLeaveActions } from './useLeaveActions';
export { default as useLeavesForEmployee } from './useLeavesForEmployee';
export { useLeaveStatus } from './useLeaveStatus';
export {
  getLeaveTypeBackground,
  getLeaveTypeIcon,
  getStatusColorClasses,
  getStatusIcon,
} from './useLeaveStyles';
export { useLoanHistory } from './useLoanHistory';
export { useLogout } from './useLogout';
export { useMessages } from './useMessages';
export { useMultiStepForm } from './useMultiForm';
export { useNotification } from './useNotification';
export { usePayslipDownload } from './usePayslipDownload';
export { usePayslipsForEmployee } from './usePayslipsForEmployee';
// Export utility functions
export { processCSVFile, processExcelFile } from './useProcessFile';
export { useCompareSalaryWithHRMS, useSalaryComparison } from './useSalaryComparison';
export { useSalaryIncrement } from './useSalaryIncrement';
export { useSocket } from './useSocket';
export { useSpecificEmployeeData } from './useSpecificEmployeeData';

export { useSubmitEditEmployeeForm } from './useSubmitEditEmployeeForm';

export { useUpdateEmployee } from './useUpdateEmployee';
export { useUpdateEmployeeAPI } from './useUpdateEmployeeAPI';
export { useUpdateEmployeeStep } from './useUpdateEmployeeStep';
export { useUploadAttendance } from './useUploadAttendance';
export { useUserCnic } from './useUserCnic';
