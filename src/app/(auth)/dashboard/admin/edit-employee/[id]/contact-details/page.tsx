import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import ContactDetails from '@/containers/admin/employee-management/create-employee/contact-details/ContactDetails';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';

export default async function EditContactDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <ContactDetails mode="edit" employeeId={id} />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
}
