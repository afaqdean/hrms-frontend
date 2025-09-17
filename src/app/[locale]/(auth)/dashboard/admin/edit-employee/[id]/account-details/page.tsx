import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import AccounDetails from '@/containers/admin/employee-management/create-employee/account-details/AccounDetails';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';

export default async function EditAccountDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <AccounDetails mode="edit" employeeId={id} />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
