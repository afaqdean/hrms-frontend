'use client';

import type { Employee } from '@/interfaces/Employee';
import EmployeeDetailsBadge from '@/components/admin/employee-section/EmployeeDetailsBadge';
import DeleteEmployee from '@/components/admin/pop-ups/DeleteEmployee';
import ModalUI from '@/components/Modal';
import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import connectionLine from 'public/assets/connection_line.png';
import React, { useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { MdDelete, MdLocationOn, MdOutlineEmail, MdPhone } from 'react-icons/md';
import { toast } from 'react-toastify';

// Define props type for the component
type EmployeeProfileDetailsProps = {
  employee?: Employee;
};

const EmployeeProfileDetails: React.FC<EmployeeProfileDetailsProps> = ({ employee }) => {
  // State to manage the visibility of the employee deletion confirmation modal
  const [employeeDeleteConfirmationModal, setEmployeeDeleteConfirmationModal] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/admin/employee/${id}`);
    },
    onSuccess: () => {
      toast.success('Employee Deleted Successfully', ToastStyle);
      queryClient.invalidateQueries({
        queryKey: ['Employees'],
      });
      setEmployeeDeleteConfirmationModal(false);
      router.push('/dashboard/admin/employees-management'); // Redirect to employee list
    },
    onError: (error) => {
      toast.error('Failed to delete employee');
      console.error(error);
      setEmployeeDeleteConfirmationModal(false);
    },
  });

  const handleDelete = async () => {
    if (employee?._id) {
      try {
        await deleteEmployeeMutation.mutateAsync(employee._id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // If no employee is selected, display a message
  if (!employee) {
    return <p className="text-center text-secondary-100">No employee selected</p>;
  }

  return (
    <div className="rounded-2xl md:p-4 xxl:p-6">
      {/* Header Section with Edit and Delete Buttons */}
      <div className="hidden items-center justify-between  md:flex md:flex-row">
        <h2 className="text-lg font-semibold">Profile Details</h2>
        <div>
          {/* Edit Employee Button */}
          <Button variant="outline" className="mr-2 size-14 bg-none" onClick={() => router.push(`/dashboard/admin/edit-employee/${employee._id}/personal-details`)}><BiSolidEditAlt className="text-3xl" /></Button>
          {/* Delete Employee Button */}
          <Button variant="outline" className="size-14 bg-none text-danger" onClick={() => setEmployeeDeleteConfirmationModal(true)}>
            <MdDelete />
          </Button>
        </div>
      </div>
      <div className="scrollbar h-full overflow-auto md:h-[60vh] xl:h-[55vh] xxl:h-[63vh]">

        {/* Employee Profile Image and Basic Info */}
        <EmployeeDetailsBadge employeeName={employee.name} imgSrc={employee.profileImage} employeePosition={employee.position} joiningDate={employee.joiningDate} employeeId={employee._id} />

        {/* Employee Leave Details Section */}
        <div className="my-4 grid grid-cols-2 gap-2 text-center text-sm md:grid-cols-4 md:gap-4">
          {/* Total Leaves */}
          <div className="rounded-lg bg-green-100 p-4">
            <p className="text-lg font-bold">
              {employee.totalAvailedLeaves}
              {' '}
              /
              {employee.totalLeaves}
            </p>
            <p className="text-sm">Total Leaves</p>
          </div>
          {/* Sick Leaves */}
          <div className="rounded-lg bg-yellow-100 p-4">
            <p className="text-lg font-bold">
              {employee.availedSickLeaves}
              {' '}
              /
              {employee.sickLeaveBank}
            </p>
            <p className="text-sm">Sick Leaves</p>
          </div>
          {/* Casual Leaves */}
          <div className="rounded-lg bg-blue-100 p-4">
            <p className="text-lg font-bold">
              {employee.availedCasualLeaves}
              {' '}
              /
              {employee.casualLeaveBank}
            </p>
            <p className="text-sm">Casual Leaves</p>
          </div>
          {/* Annual Leaves */}
          <div className="rounded-lg bg-red-100 p-4">
            <p className="text-lg font-bold">
              {employee.availedAnnualLeaves}
              {' '}
              /
              {employee.annualLeaveBank}
            </p>
            <p className="text-sm">Annual Leaves</p>
          </div>
        </div>

        {/* Employee Contact Details */}
        <div className="my-4 space-y-4 rounded-lg border border-[#F1F1F1] px-3 py-4 md:px-6">
          <h4 className="mb-2 font-semibold">Contact Details</h4>
          <div className="h-full">
            <p className="flex items-center gap-2 text-sm text-primary-100 ">
              <MdOutlineEmail className="size-4" />
              {' '}
              Email:
            </p>
            <span className="text-sm text-secondary-300">
              {employee.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-100">
            <MdPhone className="size-4" />
            <p>Phone:</p>
          </div>
          <span className="text-sm text-secondary-300">
            {' '}
            {employee?.contact?.phone || 'Not Provided'}
          </span>
          <div className="flex items-center gap-2 text-sm text-primary-100">
            <MdLocationOn className="size-4" />
            <p>Address:</p>
          </div>
          <span className="text-sm text-secondary-300">
            {' '}
            {employee?.contact?.address || 'Not Provided'}
          </span>
        </div>

        {/* Employee Emergency Contact Details */}
        <div className="space-y-6 rounded-lg border border-[#F1F1F1] px-3 py-4 md:px-6">
          <h4 className=" font-semibold">Emergency Contact Details</h4>

          <div>
            <div className="flex items-center gap-2 text-sm text-primary-100">
              <MdPhone className="size-4" />
              <p>Contact 1:</p>
            </div>

            <span className="flex items-center justify-between gap-0.5 text-sm text-secondary-300 md:justify-start md:gap-2">
              {/* {employee.emergencyContact.contact1.phone}  */}
              <span>{employee.emergencyContact?.contact1?.phone || 'Not Provided'}</span>

              <div className="hidden md:block">
                <Image src={connectionLine} alt="realation" height={24} width={178} />
              </div>
              <span className="rounded-full bg-primary-100 px-2 py-1 text-sm text-white">{employee.emergencyContact?.contact1?.relation || 'Not Specified'}</span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-primary-100">
              <MdPhone className="size-4" />
              <p>Contact 2:</p>
            </div>
            <span className="flex items-center justify-between gap-2 text-sm text-secondary-300 md:justify-start">
              <span>{employee.emergencyContact?.contact2?.phone || 'Not Provided'}</span>
              <div className="hidden md:block">
                <Image src={connectionLine} alt="realation" height={24} width={178} />
              </div>
              <span className="rounded-full bg-primary-100 px-2 py-1 text-sm text-white">
                <span>{employee.emergencyContact?.contact2?.relation || 'Not Specified'}</span>
              </span>

            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary-100">
            <MdLocationOn className="size-4" />
            <p>Address:</p>
          </div>
          <span className="text-sm text-secondary-300">
            {' '}
            {employee?.emergencyContact?.address || 'Not Provided'}
          </span>
        </div>

      </div>
      {/* Employee Deletion Confirmation Modal */}
      {employeeDeleteConfirmationModal && (
        <ModalUI
          isOpen={employeeDeleteConfirmationModal}
          handleClose={() => !deleteEmployeeMutation.isPending && setEmployeeDeleteConfirmationModal(false)}
          handleOpen={() => setEmployeeDeleteConfirmationModal(true)}
        >
          <DeleteEmployee
            onClose={() => !deleteEmployeeMutation.isPending && setEmployeeDeleteConfirmationModal(false)}
            onConfirmDelete={handleDelete}
            isDeleting={deleteEmployeeMutation.isPending}
          />
        </ModalUI>
      )}
    </div>
  );
};

export default EmployeeProfileDetails;
