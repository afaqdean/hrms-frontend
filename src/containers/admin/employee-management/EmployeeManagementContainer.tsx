'use client';

import EmployeeProfileDetails from '@/components/admin/employee-section/EmployeeProfileDetails';
import Employees from '@/components/admin/employee-section/Employees';
import DeleteEmployee from '@/components/admin/pop-ups/DeleteEmployee';
import ModalUI from '@/components/Modal';
import { ToastStyle } from '@/components/ToastStyle';

import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import useEmployees from '@/hooks/useEmployees';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { API } from '@/Interceptors/Interceptor';
import employeeRecordNotFound from '@/public/assets/NoEmployeeRecordFound.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

const NoEmployeeDisplaySection = () => {
  return (
    <div className="flex h-[68vh] flex-col items-center justify-center rounded-2xl bg-white md:mt-2 md:h-[67vh] xxl:h-full">
      <Image
        src={employeeRecordNotFound}
        alt="no-employee-records-pic"
        height={130}
        width={200}
      />
      <p className="mt-4 text-center text-sm text-secondary-400">
        No employees to display. Click on 'Add Employee' to start adding your team!
      </p>
    </div>
  );
};

const EmployeeManagement: React.FC = () => {
  // State to manage the visibility of the employee deletion confirmation modal
  const [employeeDeleteConfirmationModal, setEmployeeDeleteConfirmationModal] = useState<boolean>(false);
  const { slug } = useParams(); // Get slug from URL
  const employeeId = Array.isArray(slug) ? slug[0] : slug; // Ensure it's always a string

  const { resetForm } = useMultiStepForm();

  const router = useRouter(); // To navigate on click
  const { Employees: employeeData, isLoading } = useEmployees();

  // Track selected employee ID
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(employeeId || null);

  // State to track the selected machine ID
  const [_selectedMachineID, setSelectedMachineID] = useState<string>('');
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
      setEmployeeDeleteConfirmationModal(false); // Close modal after successful deletion
      router.push('/dashboard/admin/employees-management'); // Redirect to employee list
    },
    onError: (error) => {
      toast.error('Failed to delete employee');
      console.error(error);
      setEmployeeDeleteConfirmationModal(false); // Close modal on error
    },
  });

  useEffect(() => {
    if (employeeId) {
      setSelectedEmployeeId(employeeId);
    }
  }, [employeeId]);

  // When employeeData is available, update selectedMachineID
  useEffect(() => {
    if (employeeData && employeeData.length > 0) {
      const selectedEmployee = employeeData.find(emp => emp._id === selectedEmployeeId);
      setSelectedMachineID(selectedEmployee?.machineID || '');
    }
  }, [employeeData, selectedEmployeeId]);

  if (isLoading || !employeeData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center ">
        <Loader />
      </div>
    );
  }

  // Find the selected employee based on the slug
  const selectedEmployee = employeeData.find(emp => emp._id === selectedEmployeeId);

  const handleDelete = async () => {
    if (selectedEmployee?._id) {
      try {
        await deleteEmployeeMutation.mutateAsync(selectedEmployee._id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <div className="size-full rounded-2xl px-2 py-4 md:px-0 md:py-2 xl:h-[75vh] xl:py-4 xxl:h-[76vh]">

      {!selectedEmployee
        ? (

            <div className="flex items-center justify-between md:mb-0">
              <span>
                <h2 className="text-base font-medium text-primary-100">Employees</h2>
                <p className="text-sm text-secondary-300">
                  Create and Manage Your Team Efficiently
                </p>
              </span>

              <Link
                href="/dashboard/admin/add-employee"
                onClick={() => {
                  localStorage.removeItem('employee_creation_form_data');
                  resetForm();
                }}
                className="flex size-12 items-center justify-center gap-2 rounded-full bg-primary-100 text-white hover:bg-black  md:size-10 md:w-52 md:rounded-xl  md:px-4 md:py-2"
              >
                <span className="flex items-center  justify-center gap-2">
                  <IoMdAdd className=" size-6 text-sm  md:size-5 md:text-lg" />
                  <span className="hidden  md:block">Add employee</span>
                </span>
              </Link>
            </div>

          )
        : (
            <div className="hidden md:block">
              <div className="flex items-center justify-between md:mb-2 xl:mb-0">
                <span>
                  <h2 className="text-base font-medium text-primary-100">Employees</h2>
                  <p className="text-sm text-secondary-300">
                    Create and Manage Your Team Efficiently
                  </p>
                </span>

                <Link
                  href="/dashboard/admin/add-employee"
                  className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-white  hover:bg-black md:w-52 md:rounded-xl  md:px-4 md:py-2"
                  onClick={() => {
                    localStorage.removeItem('employee_creation_form_data');
                    resetForm();
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <IoMdAdd className=" size-5   text-sm md:text-lg" />
                    <span className="hidden  md:block">Add employee</span>
                  </span>
                </Link>
              </div>
            </div>
          )}

      {/* Show "No Employee" section if no employees exist */}
      {employeeData?.length === 0
        ? (
            <NoEmployeeDisplaySection />

          )
        : (
            <div className="flex flex-col gap-4 rounded-xl md:mt-1  md:flex-row">
              {/* Mobile: Show Full Screen List OR Details */}
              <div className="block md:hidden">
                {!selectedEmployee
                  ? (
                // Employees List (Full Screen)
                      <div className="mt-4 size-full rounded-2xl bg-white md:mt-0">
                        <Employees
                          employees={employeeData}
                          setter={(index) => {
                            const selectedEmployee = employeeData?.[index];
                            if (selectedEmployee) {
                              router.push(`/dashboard/admin/employees-management/${selectedEmployee._id}`);
                            }
                          }}
                        />
                      </div>
                    )
                  : (
                // Employee Profile Details (Full Screen)
                      <div className="size-full rounded-2xl bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            <Button
                              variant="outline"
                              onClick={() => router.push('/dashboard/admin/employees-management')}
                              className="mx-2 my-4 size-6 rounded-none border-none bg-none px-4 py-2  text-sm shadow-none"
                            >
                              <FaArrowLeft />
                            </Button>
                            <h4 className="text-lg font-medium">Profile Details</h4>
                          </div>
                          <div className="mr-2">
                            {/* Edit Employee Button */}
                            <Button variant="outline" className="mr-2 size-10 bg-none text-primary-100" onClick={() => router.push(`/dashboard/admin/edit-employee/${selectedEmployee._id}/personal-details`)}><BiSolidEditAlt /></Button>
                            {/* Delete Employee Button */}
                            <Button variant="outline" className="size-10 bg-none text-danger" onClick={() => setEmployeeDeleteConfirmationModal(true)}><MdDelete /></Button>
                          </div>
                          {/* Employee Deletion Confirmation Modal */}
                          {
                            employeeDeleteConfirmationModal && (
                              <ModalUI isOpen={employeeDeleteConfirmationModal} handleClose={() => !deleteEmployeeMutation.isPending && setEmployeeDeleteConfirmationModal(false)} handleOpen={() => setEmployeeDeleteConfirmationModal(true)}>
                                <DeleteEmployee onClose={() => !deleteEmployeeMutation.isPending && setEmployeeDeleteConfirmationModal(false)} onConfirmDelete={handleDelete} isDeleting={deleteEmployeeMutation.isPending} />
                              </ModalUI>
                            )
                          }
                        </div>
                        <div className="mb-5 p-4 md:mb-0">
                          <EmployeeProfileDetails employee={selectedEmployee} />

                        </div>
                      </div>
                    )}
              </div>

              {/* Desktop View - No Changes */}
              <div className="hidden w-full gap-4 md:flex">
                {/* Employees List on the Left */}
                <div className="mt-4 h-[71vh] w-full rounded-2xl bg-white md:mt-0 md:w-[70vw] xl:mt-0 xl:h-[68vh] xl:w-2/5 xxl:h-[74vh]">
                  <Employees
                    employees={employeeData}
                    setter={(index) => {
                      const selectedEmployee = employeeData?.[index];
                      if (selectedEmployee) {
                        router.push(`/dashboard/admin/employees-management/${selectedEmployee._id}`);
                      }
                    }}
                  />
                </div>

                {/* Employee Details on the Right */}
                <div className="md:scrollbar hidden size-full rounded-2xl bg-white md:block md:h-[71vh] md:w-full  xl:h-[68vh] xl:w-3/4 xl:overflow-y-scroll xxl:h-[74vh]">
                  {selectedEmployee
                    ? (
                        <EmployeeProfileDetails employee={selectedEmployee} />
                      )
                    : (
                        <div className="flex h-full items-center justify-center">
                          <h1 className="font-medium text-secondary-300 md:text-2xl xl:text-3xl">
                            Select an employee to view details
                          </h1>
                        </div>
                      )}
                </div>
              </div>
            </div>
          )}
    </div>
  );
};

export default EmployeeManagement;
