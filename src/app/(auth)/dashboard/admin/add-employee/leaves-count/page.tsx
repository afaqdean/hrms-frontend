import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import LeavesCount from '@/containers/admin/employee-management/create-employee/leaves-count/LeavesCount';

export default async function AddLeavesCountPage() {
  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <LeavesCount mode="create" />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
