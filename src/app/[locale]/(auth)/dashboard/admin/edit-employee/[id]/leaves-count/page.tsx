import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import LeavesCount from '@/containers/admin/employee-management/create-employee/leaves-count/LeavesCount';

export default async function EditLeavesCountPage({
  params,
}: {
  params: any;
}) {
  const { id } = await params;

  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <LeavesCount mode="edit" employeeId={id} />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
