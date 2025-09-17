import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import EmergencyContactDetails from '@/containers/admin/employee-management/create-employee/emergency-contact-details/EmergencyContactDetails';

export default async function EditEmergencyContactDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <EmergencyContactDetails mode="edit" employeeId={id} />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
