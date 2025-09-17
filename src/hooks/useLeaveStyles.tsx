import type { ReactElement } from 'react';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { CiMedicalCross } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { LuClock5 } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';

// Function to get status icon based on leave status
export const getStatusIcon = (status: string | undefined): ReactElement | null => {
  if (status === 'Approved') {
    return <FaCheck />;
  }
  if (status === 'Pending') {
    return <LuClock5 />;
  }
  if (status === 'Rejected') {
    return <MdClose />;
  }
  return null;
};

// Function to get leave type icon
export const getLeaveTypeIcon = (leaveType: string): ReactElement | null => {
  switch (leaveType?.toLowerCase()) {
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

// Function to get background color based on leave type
export const getLeaveTypeBackground = (leaveType: string): string => {
  switch (leaveType?.toLowerCase()) {
    case 'sick':
      return 'bg-[#E3EEFF]';
    case 'casual':
      return 'bg-[#FFD2CF]';
    case 'annual':
      return 'bg-light-success';
    default:
      return 'bg-[#E3EEFF]';
  }
};

// Function to get status color classes
export const getStatusColorClasses = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'bg-light-success text-success';
    case 'Pending':
      return 'bg-light-warning text-warning';
    case 'Rejected':
      return 'bg-light-danger text-danger';
    default:
      return '';
  }
};
