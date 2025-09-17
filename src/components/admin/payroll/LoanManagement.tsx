'use client';

import type { Employee } from '@/interfaces/Employee';
import React from 'react';
import { LoanManagementRefactored } from './loan';

type LoanManagementProps = {
  employeeId?: string;
  employeeData?: Employee; // ✅ Properly typed using Employee interface
};

const LoanManagement: React.FC<LoanManagementProps> = ({ employeeId, employeeData }) => {
  return <LoanManagementRefactored employeeId={employeeId} employeeData={employeeData} />;
};

export default LoanManagement;
