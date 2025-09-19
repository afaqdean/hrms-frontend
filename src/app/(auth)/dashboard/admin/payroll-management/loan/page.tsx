'use client';

import LoanManagement from '@/components/admin/payroll/LoanManagement';
import BackArrow from '@/components/ui/back-arrow';
import React from 'react';

export default function LoanManagementPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex items-center gap-4">
          <BackArrow href="/dashboard/admin/payroll-management" />
          <h1 className="text-2xl font-bold text-primary-100">Loan Management</h1>
        </div>

        <LoanManagement />
      </div>
    </div>
  );
}
