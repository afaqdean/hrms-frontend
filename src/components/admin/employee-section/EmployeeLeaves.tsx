'use client';

import type { Employee } from '@/interfaces/Employee';
import type { Leave } from '@/interfaces/Leave';
import EmployeeDetailsBadge from '@/components/admin/employee-section/EmployeeDetailsBadge';
import EditLeaves from '@/components/admin/pop-ups/EditLeaves';
import ModalUI from '@/components/Modal';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

type EmployeeLeavesProps = {
  employee: Employee;
  leaveData?: Leave[]; // Leave data is passed as a prop instead of using state
};

const EmployeeLeaves: React.FC<EmployeeLeavesProps> = ({ employee }) => {
  const [editLeaves, setEditLeaves] = useState<boolean>(false);

  return (
    <div className="px-2 md:p-4">
      {/* Employee Profile Image and Basic Info */}
      <div className="md:hidden">
        <EmployeeDetailsBadge employeeName={employee.name} imgSrc={employee.profileImage} employeePosition={employee.position} joiningDate={employee.joiningDate} employeeId={employee._id} />

      </div>
      {/* Header section with title and edit button */}
      <div className="mt-4 flex items-center justify-between md:mt-0">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold md:text-lg">Leave Analytics</h2>
          <p className="mt-2 hidden text-xs text-secondary-300 md:block md:text-sm">
            View detailed leave records for each employee
          </p>
        </div>
        <div>
          {/* Edit button to open the leave modal */}
          <Button variant="outline" className="mr-2 hidden md:inline" onClick={() => setEditLeaves(true)}>
            <BiSolidEditAlt />

          </Button>

          {editLeaves && (
            <ModalUI
              // Handle modal open/close
              handleOpen={() => setEditLeaves(true)}
              isOpen={editLeaves}
              handleClose={() => setEditLeaves(false)}
            >
              <EditLeaves selectedEmployeeId={employee._id} onClose={() => setEditLeaves(false)} />
            </ModalUI>
          )}
        </div>
      </div>

      {/* Leave summary cards */}
      <div className="my-4 grid grid-cols-2 gap-2 text-center md:grid-cols-4 md:gap-4">
        <div className="rounded-lg bg-green-100 p-4">
          <p className="text-lg font-bold">
            {employee?.totalAvailedLeaves}
            {' '}
            /
            {employee?.totalLeaves}
          </p>
          <p className="text-sm">Total Leaves</p>
        </div>
        <div className="rounded-lg bg-yellow-100 p-4">
          <p className="text-lg font-bold">
            {employee?.availedSickLeaves}
            {' '}
            /
            {employee?.sickLeaveBank}
          </p>
          <p className="text-sm">Sick Leaves</p>
        </div>
        <div className="rounded-lg bg-blue-100 p-4">
          <p className="text-lg font-bold">
            {employee?.availedCasualLeaves}
            {' '}
            /
            {employee?.casualLeaveBank}
          </p>
          <p className="text-sm">Casual Leaves</p>
        </div>
        <div className="rounded-lg bg-red-100 p-4">
          <p className="text-lg font-bold">
            {employee?.availedAnnualLeaves}
            {' '}
            /
            {employee?.annualLeaveBank}
          </p>
          <p className="text-sm">Annual Leaves</p>
        </div>
      </div>

    </div>
  );
};

export default EmployeeLeaves;
