'use client';
import CreateLeaveRequest from '@/components/employee/pop-ups/CreateLeaveRequest';
import ModalUI from '@/components/Modal';
import MobileLeavesHistory from '@/components/shared/mobile-views/MobileLeavesHistory';
import LeavesHistoryTrackingTable from '@/components/shared/tables/leaves-history/LeavesHistoryTrackingTable';
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';

const LeavesHistoryContainer = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState<boolean>(false);
  return (
    <div className="mt-2 p-2 md:p-0">
      <div className="flex flex-col justify-start  md:flex-row md:items-center md:justify-between md:px-0">
        <div className="flex justify-between  md:flex-none">
          <span className="mt-2 w-1/2 text-lg  font-medium text-primary-100 md:mt-0 md:w-full">Leaves History</span>
          <Button variant="outline" className="w-32 rounded-full hover:bg-primary-100 hover:text-white md:hidden" onClick={() => setApplyLeaveModalOpen(true)}>
            <BsArrowUpRightCircle className="" />
            <span className="text-xs">Apply Leave</span>
          </Button>
          {applyLeaveModalOpen && (
            <ModalUI isOpen={applyLeaveModalOpen} handleClose={() => setApplyLeaveModalOpen(false)} handleOpen={() => setApplyLeaveModalOpen(true)}>
              <CreateLeaveRequest onClose={() => setApplyLeaveModalOpen(false)} />
            </ModalUI>
          )}
        </div>

        <div className="mt-3 flex w-full justify-between gap-2 md:mt-0 md:justify-end">
          {/* Leave Type Filter */}
          <Select onValueChange={setTypeFilter} value={typeFilter}>
            <SelectTrigger className="w-1/2 bg-white md:w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Casual Leave">Casual</SelectItem>
              <SelectItem value="Sick Leave">Sick</SelectItem>
              <SelectItem value="Annual Leave">Annual</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-1/2 bg-white md:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 h-full xl:h-[67vh] xxl:h-[75vh]">
        <LeavesHistoryTrackingTable typeFilter={typeFilter} statusFilter={statusFilter} />
        <MobileLeavesHistory statusFilter={statusFilter} typeFilter={typeFilter} />
      </div>
    </div>
  );
};

export default LeavesHistoryContainer;
