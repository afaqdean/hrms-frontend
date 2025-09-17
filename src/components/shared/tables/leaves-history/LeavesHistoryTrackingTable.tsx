'use client';

import type { Leave } from '@/interfaces/Leave';
import ModalUI from '@/components/Modal';
import ViewLeaveApplication from '@/components/shared/pop-ups/ViewLeaveApplication';
import useLeavesForEmployee from '@/hooks/useLeavesForEmployee';
import Image from 'next/image';
import Link from 'next/link';
import leaveHistoryNotFound from 'public/assets/leave-history-record-not-found.png';
import React, { useMemo, useState } from 'react';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { CiMedicalCross } from 'react-icons/ci';
import { FiCheck, FiFileText } from 'react-icons/fi';
import { GiSandsOfTime } from 'react-icons/gi';
import { LuClock5 } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../ui/table';
import Avatar from '../../avatars/avatar/Avatar';

type LeavesHistoryTrackingTableProps = {
  typeFilter: string;
  statusFilter: string;
};

const NoTableDataFound = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="w-full">
        <div className="flex flex-col items-center justify-center bg-secondary-100 xl:h-[53vh] xxl:h-[64vh]">
          <Image src={leaveHistoryNotFound} alt="no-record-found" height={130} width={151} />
          <p className="mt-2 text-center text-sm text-secondary-400">
            Uh-oh! It seems there are no leave history records to display here
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

const LoadingMessage = () => (
  <div className=" hidden h-full flex-col items-center justify-center bg-white md:flex">
    <p className="text-center text-sm text-secondary-400">Loading Leaves...</p>
  </div>
);

const LeavesHistoryTrackingTable: React.FC<LeavesHistoryTrackingTableProps> = ({ typeFilter, statusFilter }) => {
  const [viewLeaveApplicationModal, setViewApplicationModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const { Leaves, isLoading } = useLeavesForEmployee();

  const filteredLeaveData = useMemo(() => {
    let filteredData = [...(Leaves || [])];

    if (typeFilter && typeFilter !== 'All') {
      filteredData = filteredData.filter((l) => {
        const leaveTypeLower = l.leaveType.toLowerCase();
        const filterTypeLower = typeFilter.toLowerCase();

        return (
          leaveTypeLower === filterTypeLower
          // Handle Casual Leave cases
          || (filterTypeLower === 'casual leave' && leaveTypeLower === 'casual')
          // Handle Sick Leave cases
          || (filterTypeLower === 'sick leave' && leaveTypeLower === 'sick')
          // Handle Annual Leave cases
          || (filterTypeLower === 'annual leave' && leaveTypeLower === 'annual')
        );
      });
    }

    if (statusFilter && statusFilter !== 'All') {
      filteredData = filteredData.filter(l => l.status === statusFilter);
    }

    return filteredData;
  }, [Leaves, typeFilter, statusFilter]);

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') {
      return <FiCheck />;
    }
    if (status === 'Rejected') {
      return <RxCross2 />;
    }
    return <LuClock5 />;
  };
  const formatLeaveType = (leaveType?: string) => {
    if (!leaveType || leaveType.trim() === '') {
      return 'Leave';
    } // Handle undefined or empty string

    const words = leaveType.trim().split(' ');

    // Check if words array is empty before accessing the last element
    const lastWord = words.length > 0 ? words[words.length - 1] : '';

    if (lastWord?.toLowerCase() === 'leave') {
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Otherwise, add "Leave" and capitalize properly
    return [...words, 'Leave']
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return <LoadingMessage />;
  }

  // Function to get Leave Type Icon
  const getLeaveTypeIcon = (leaveType: string) => {
    switch (leaveType.toLowerCase()) {
      case 'sick':
        return <CiMedicalCross />;
      case 'casual':
        return <GiSandsOfTime />;
      case 'annual':
        return <BiSolidPlaneAlt />;
      default:
        return null;
    }
  };

  // Helper function to get leave type background
  const getLeaveTypeBackground = (leaveType: string) => {
    const type = leaveType.toLowerCase();
    if (type.includes('sick')) {
      return 'bg-[#E3EEFF]';
    }
    if (type.includes('casual')) {
      return 'bg-[#FFD2CF]';
    }
    if (type.includes('annual')) {
      return 'bg-light-success';
    }
    return '';
  };

  const openModal = async (leave: Leave) => {
    setSelectedLeave(leave);
    setViewApplicationModal(true);
  };

  const closeModal = () => {
    setSelectedLeave(null);
    setViewApplicationModal(false);
  };

  return (
    <div className="scrollbar hidden size-full overflow-y-scroll rounded-2xl bg-white p-6 shadow-md md:block">
      <Table>
        <TableHeader className="custom-table-header sticky top-0 z-10">
          <TableRow className="">
            <TableCell>Leave Type</TableCell>
            <TableCell>Submission Date</TableCell>
            <TableCell>Attachment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>View Leave</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? (
                <TableRow>
                  <TableCell colSpan={4} className="">
                    <NoTableDataFound />
                  </TableCell>
                </TableRow>
              )
            : filteredLeaveData.length === 0
              ? (
                  <NoTableDataFound />
                )
              : (
                  [...filteredLeaveData]?.map(entry => (
                    <TableRow key={entry._id} className="border-b">

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar
                            className={getLeaveTypeBackground(entry?.leaveType)}
                            icon={getLeaveTypeIcon(entry?.leaveType)}
                          />
                          <span className="text-primary-100">
                            {formatLeaveType(entry?.leaveType)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-primary-100">
                          <span className="rounded-full bg-[#E3EEFF] px-4 py-3 text-primary-100">
                            {entry.date}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {entry?.attachmentUrl
                          ? (
                              <Link
                                href={entry.attachmentUrl}
                                rel="noopener noreferrer"
                                download={entry.attachmentUrl.split('_').pop()}
                                className="flex w-44 cursor-pointer items-center justify-center gap-1 rounded-full bg-[#E3EEFF] px-4 py-3 text-primary-100 hover:underline"

                              >
                                <FiFileText className="size-4" />
                                <span>Attachment</span>
                              </Link>
                            )
                          : (
                              <span className="flex w-44 cursor-default items-center justify-center gap-1 rounded-full bg-[#E3EEFF] px-4 py-3 text-primary-100">
                                <FiFileText className="size-4" />
                                <span>No Attachment</span>
                              </span>
                            )}
                      </TableCell>

                      <TableCell>
                        <div className="flex max-w-20 items-center justify-center gap-2 rounded-full p-1">
                          <span
                            className={`flex items-center gap-1 rounded-full px-4 py-3 ${
                              entry.status === 'Approved'
                                ? 'bg-light-success text-[#177B1B]'
                                : entry.status === 'Pending'
                                  ? 'bg-light-warning text-warning'
                                  : 'bg-light-danger text-danger'
                            }`}
                          >
                            <p className="flex items-center gap-1">
                              {getStatusIcon(entry.status)}
                              <span>{entry.status}</span>
                            </p>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <BsArrowUpRightCircle
                          onClick={() => openModal(entry)}
                          className="size-6 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-150 hover:text-black"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
        </TableBody>
      </Table>

      {viewLeaveApplicationModal && selectedLeave && (
        <ModalUI
          handleClose={() => closeModal()}
          handleOpen={() => setViewApplicationModal(true)}
          isOpen={viewLeaveApplicationModal}
        >
          <ViewLeaveApplication leaveData={selectedLeave} onClose={() => closeModal()} />
        </ModalUI>
      )}
    </div>
  );
};

export default LeavesHistoryTrackingTable;
