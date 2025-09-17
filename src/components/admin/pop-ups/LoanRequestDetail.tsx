'use client';

import type { LoanRequest } from '@/interfaces/LoanRequest';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import React from 'react';
import Avatar from '../../shared/avatars/avatar/Avatar';

type LoanRequestDetailProps = {
  loanRequest: LoanRequest;
  onClose: () => void;
};

const LoanRequestDetail: React.FC<LoanRequestDetailProps> = ({ loanRequest, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="size-4" />;
      case 'Declined':
        return <XCircle className="size-4" />;
      case 'Pending':
        return <Clock className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Loan Request Details</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Employee Information */}
      <div className="mb-6 rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Employee Information</h3>
        <div className="flex items-center space-x-3">
          <Avatar src={loanRequest.employeeProfileImage || '/assets/profile_avatar_placeholder.png'} />
          <div>
            <div className="font-medium text-gray-900">
              {loanRequest.employeeName || `Employee ${loanRequest.employeeId}`}
            </div>
            <div className="text-sm text-gray-500">
              {loanRequest.employeeEmail || 'No email available'}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Loan Amount</div>
            <div className="mt-1 text-lg font-semibold text-primary-100">
              PKR
              {' '}
              {loanRequest.amount.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Monthly Deduction</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              PKR
              {' '}
              {loanRequest.deductionPerMonth.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Installments</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {loanRequest.installments}
              {' '}
              months
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Remaining Amount</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              PKR
              {' '}
              {loanRequest.remainingAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Reason for Loan</div>
          <div className="mt-1 text-gray-900">{loanRequest.reason}</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Request Date</div>
            <div className="mt-1 text-gray-900">
              {new Date(loanRequest.requestedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div className="mt-1">
              <Badge className={`${getStatusColor(loanRequest.status)} flex w-fit items-center gap-1`}>
                {getStatusIcon(loanRequest.status)}
                {loanRequest.status}
              </Badge>
            </div>
          </div>
        </div>

        {loanRequest.deductionStartDate && (
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Deduction Start Date</div>
            <div className="mt-1 text-gray-900">
              {new Date(loanRequest.deductionStartDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        )}

        {loanRequest.adminRemarks && (
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-gray-500">Admin Remarks</div>
            <div className="mt-1 text-gray-900">{loanRequest.adminRemarks}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default LoanRequestDetail;
