'use client';

import type { Leave } from '@/interfaces/Leave';
import EmployeeLeaves from '@/components/admin/employee-section/EmployeeLeaves';
import EmployeeLeaveCard from '@/components/admin/employee-section/EmployeeLeavesCard';
import Employees from '@/components/admin/employee-section/Employees';
import EditLeaves from '@/components/admin/pop-ups/EditLeaves';
import ModalUI from '@/components/Modal';
import { Button } from '@/components/ui/button';
import useLeavesForAdmin from '@/hooks/useLeavesForAdmin';
import useSelectedEmployee from '@/hooks/useSelectedEmployee';
import employeeRecordNotFound from '@/public/assets/NoEmployeeRecordFound.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';

const Loader = () => (
  <div className="flex h-[70vh] w-full items-center justify-center rounded-2xl bg-white xxl:h-[80vh]">
    Loading....
  </div>
);

// Add the NoEmployeeDisplaySection component
const NoEmployeeDisplaySection = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center rounded-2xl bg-white md:h-[73vh] xl:mt-2">
      <Image
        src={employeeRecordNotFound}
        alt="no-employee-records-pic"
        height={130}
        width={200}
      />
      <p className="mt-4 text-center text-sm text-secondary-400">
        No employees to display..!!
      </p>
    </div>
  );
};

const LeavesManagementContainer: React.FC = () => {
  const [editLeaves, setEditLeaves] = useState<boolean>(false);

  const { selectedEmployeeId, selectedEmployee, setSelectedEmployeeId, employeeData, employeeLoading } = useSelectedEmployee();
  const { Leaves: selectedEmployeeLeaves = [], isLoading: leavesLoading } = useLeavesForAdmin(selectedEmployeeId ?? '');

  const router = useRouter();

  return (
    <div className="flex h-full flex-row rounded-xl pt-4 md:flex-row">
      {employeeLoading
        ? (
            <Loader />
          )
        : employeeData?.length > 0
          ? (
              <div className="flex size-full gap-4">
                {/* Employee List Section */}
                <div className={`mx-2 w-full rounded-2xl md:mx-0 md:w-[50vw] md:bg-white xl:h-[75vh] xl:w-2/5 xxl:h-[80vh] ${selectedEmployee ? 'hidden md:block md:w-1/3' : 'w-full'}`}>
                  <div className="mb-3 md:hidden">
                    <h3 className="text-lg font-medium text-primary-100">Leaves Management</h3>
                    <p className="mt-1 text-xs text-secondary-300 md:text-sm">
                      View detailed leave records for each employee
                    </p>
                  </div>
                  <Employees
                    scrollParentStyles="xl:h-[55vh] xxl:h-[62vh]"
                    employees={employeeData}
                    setter={(index) => {
                      const selectedEmployee = employeeData?.[index];
                      if (selectedEmployee) {
                        setSelectedEmployeeId(selectedEmployee._id);
                        router.push(`/dashboard/admin/leaves-management/${selectedEmployee._id}`);
                      }
                    }}
                  />
                </div>

                {/* Employee Leave Details Section */}
                <div className={`mx-2 size-full rounded-2xl bg-white md:mx-0 md:h-[70vh] md:w-[70vw] lg:h-[75vh] xl:w-3/4 xxl:h-[80vh] ${selectedEmployee ? 'block' : 'hidden md:block'}`}>
                  {selectedEmployee
                    ? (
                        <div>
                          <div className="flex items-center justify-between gap-0.5  py-4 md:hidden">
                            <div className="flex items-center gap-0.5">
                              <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard/admin/leaves-management')}
                                className="mx-2 my-4 size-6 rounded-none border-none bg-none px-4 py-2 text-sm shadow-none"
                              >
                                <FaArrowLeft />
                              </Button>
                              <h4 className="text-lg font-medium">Leave Details</h4>
                            </div>
                            {/* Edit button to open the leave modal */}
                            <Button variant="outline" className="mr-2 flex h-12 w-6 items-center justify-center md:hidden" onClick={() => setEditLeaves(true)}>
                              <BiSolidEditAlt />
                            </Button>

                            {editLeaves && (
                              <ModalUI
                                // Handle modal open/close
                                handleOpen={() => setEditLeaves(true)}
                                isOpen={editLeaves}
                                handleClose={() => setEditLeaves(false)}
                              >
                                <EditLeaves selectedEmployeeId={selectedEmployeeId} onClose={() => setEditLeaves(false)} />
                              </ModalUI>
                            )}
                          </div>
                          <EmployeeLeaves employee={selectedEmployee} />
                          <h5 className="mt-3 pl-4 pt-4 text-sm font-medium md:mt-0">Leaves History</h5>
                          <div className="md:scrollbar size-full overflow-y-scroll rounded-xl  md:h-[30vh] lg:h-[40vh]  xxl:h-[55vh]">
                            {leavesLoading
                              ? (
                                  <div className="flex h-full items-center justify-center">
                                    <p className="text-lg font-semibold text-gray-500">Loading leaves...</p>
                                  </div>
                                )
                              : selectedEmployeeLeaves.length > 0
                                ? (
                                    <>
                                      {[...selectedEmployeeLeaves].map((leave: Leave) => (
                                        <EmployeeLeaveCard key={leave._id} leave={leave} />
                                      ))}
                                    </>
                                  )
                                : (
                                    <div className="flex h-full items-center justify-center">
                                      <p className="text-lg text-gray-500 max-sm:mt-4 md:text-2xl">No leave records found.</p>
                                    </div>
                                  )}
                          </div>
                        </div>
                      )
                    : (
                        <div className="flex h-full items-center justify-center ">
                          <p className="text-2xl font-medium text-secondary-300 xl:text-3xl">Select an employee to view leave details</p>
                        </div>
                      )}
                </div>
              </div>
            )
          : (
              <NoEmployeeDisplaySection />
            )}
    </div>
  );
};

export default LeavesManagementContainer;
