import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import PersonalDetails from '@/containers/admin/employee-management/create-employee/personal-details/PersonalDetails';

export default async function EditPersonalDetailsPage({
  params,
}: Readonly<{
  params: any;
}>) {
  const { id } = await params;

  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <PersonalDetails mode="edit" employeeId={id} />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
