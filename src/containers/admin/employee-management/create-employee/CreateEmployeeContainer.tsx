'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useMemo } from 'react';
import { FaArrowLeft, FaRegUser } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdOutlineAccountBox, MdOutlinePhoneEnabled } from 'react-icons/md';

const EmployeeFormContext = createContext<{
  mode: 'edit' | 'create';
  employeeId?: string;
}>({ mode: 'create' });

const getSteps = (employeeId?: string) => [
  {
    label: 'Personal Details',
    icon: FaRegUser,
    path: employeeId
      ? `/dashboard/admin/edit-employee/${employeeId}/personal-details`
      : '/dashboard/admin/add-employee',
  },
  {
    label: 'Account Details',
    icon: MdOutlineAccountBox,
    path: employeeId
      ? `/dashboard/admin/edit-employee/${employeeId}/account-details`
      : '/dashboard/admin/add-employee/account-details',
  },
  {
    label: 'Contact Details',
    icon: MdOutlinePhoneEnabled,
    path: employeeId
      ? `/dashboard/admin/edit-employee/${employeeId}/contact-details`
      : '/dashboard/admin/add-employee/contact-details',
  },
  {
    label: 'Emergency Contact',
    icon: MdOutlinePhoneEnabled,
    path: employeeId
      ? `/dashboard/admin/edit-employee/${employeeId}/emergency-contact-details`
      : '/dashboard/admin/add-employee/emergency-contact-details',
  },
  {
    label: 'Leaves Count',
    icon: IoDocumentTextOutline,
    path: employeeId
      ? `/dashboard/admin/edit-employee/${employeeId}/leaves-count`
      : '/dashboard/admin/add-employee/leaves-count',
  },
];

type CreateEmployeeContainerProps = {
  children?: React.ReactNode;
};

const CreateEmployeeContainer: React.FC<CreateEmployeeContainerProps> = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();

  // Detect if we're in edit mode and get the employee ID from the URL
  const { isEditing, employeeId } = useMemo(() => {
    const pathParts = pathName.split('/');
    const isEditPath = pathParts.includes('edit-employee');
    // Extract employeeId from the URL pattern: /dashboard/admin/edit-employee/{id}/personal-details
    const id = isEditPath ? pathParts[pathParts.indexOf('edit-employee') + 1] : undefined;
    return { isEditing: isEditPath, employeeId: id };
  }, [pathName]);

  const steps = getSteps(employeeId);

  const isStepActive = (stepPath: string) => {
    if (isEditing) {
      // For edit mode, match the step name (personal-details, account-details, etc.)
      const currentStep = pathName.split('/').pop();
      const stepName = stepPath.split('/').pop();
      return currentStep === stepName;
    } else {
      // For add mode, use the existing logic
      const isPersonalActive = pathName === '/dashboard/admin/add-employee'
        && stepPath === '/dashboard/admin/add-employee/personal-details';
      return pathName === stepPath || isPersonalActive;
    }
  };

  return (
    <div className="my-auto max-md:mx-2">
      <div className="my-4 size-full rounded-2xl bg-white px-2 py-4 md:m-0 md:mt-4 md:h-[71vh] md:p-2 xl:h-[75vh] xl:p-6 xxl:h-[80vh]">
        <div className={`max-md:mb-3 ${!isStepActive(steps[0]?.path || '') ? 'max-md:hidden' : ''}`}>
          <div className="flex items-center gap-2 md:flex-none">
            <FaArrowLeft
              className="md:hidden"
              onClick={() => router.push('/dashboard/admin/employees-management')}
            />
            <h2 className="text-base font-medium text-primary-100">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h2>
          </div>
          <p className="text-xs text-secondary-400 max-md:mt-2 md:text-sm">
            {isEditing
              ? 'Update employee information in 5 simple steps'
              : 'Follow the simple 5 steps to register a new member'}
          </p>
          <hr className="mt-3 w-full border-[#F1F1F1] md:my-1 xl:my-3" />
        </div>

        <div className="mt-5 h-full gap-4 md:flex md:h-[55vh] xl:h-[57vh] xxl:h-[68vh]">
          {/* Sidebar Steps */}
          <div className="hidden h-full w-1/3 flex-col justify-center space-y-3 rounded-2xl bg-secondary-100 px-6 py-10 md:flex md:px-3 md:py-5 xl:px-6">
            {steps.map((step) => {
              const isActive = isStepActive(step.path);
              const Icon = step.icon;

              return (
                <Link
                  key={step.label}
                  href={step.path}
                  className={`group flex w-full items-center justify-between gap-4 rounded-lg px-3 transition-all xl:py-2
                  ${isActive ? 'text-primary-100' : 'text-secondary-300 hover:text-primary-100'}`}
                >
                  <span className="text-sm font-medium transition-all group-hover:text-primary-100 md:text-xs xl:text-sm">
                    {step.label}
                  </span>
                  <span
                    className={`flex size-12 items-center justify-center rounded-full transition-all
                    ${isActive
                  ? 'bg-primary-100 text-white'
                  : 'bg-white text-primary-100 group-hover:bg-primary-100 group-hover:text-white'
                }`}
                  >
                    <Icon className="size-5 transition-all" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex w-full items-start md:items-center">
            <EmployeeFormContext.Provider value={useMemo(() => ({ mode: isEditing ? 'edit' : 'create', employeeId }), [isEditing, employeeId])}>
              {children}
            </EmployeeFormContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeContainer;
