import { useLeaveStatus } from '@/hooks/useLeaveStatus';

export const useLeaveActions = (leaveData: any, onClose: () => void) => {
  const { updateLeaveStatus } = useLeaveStatus();

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveData?._id) {
      return;
    }
    try {
      await updateLeaveStatus.mutateAsync({ leaveId: leaveData._id, status: 'Approved' });
      // if (leaveData?.employeeId) {
      //   await updateUserData(leaveData.employeeId);
      // }
      onClose();
    } catch (error) {
      console.error('Error Approving Leave:', error);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveData?._id) {
      return;
    }
    try {
      await updateLeaveStatus.mutateAsync({ leaveId: leaveData._id, status: 'Rejected' });
      // if (leaveData?.employeeId) {
      //   await updateUserData(leaveData.employeeId);
      // }
      onClose();
    } catch (error) {
      console.error('Error Rejecting Leave:', error);
    }
  };

  return {
    handleApprove,
    handleReject,
    isApproving: updateLeaveStatus.isPending && updateLeaveStatus.variables?.status === 'Approved',
    isRejecting: updateLeaveStatus.isPending && updateLeaveStatus.variables?.status === 'Rejected',
  };
};
