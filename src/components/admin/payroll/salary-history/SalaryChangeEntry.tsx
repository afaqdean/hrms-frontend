import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import { formatAmount } from '@/utils/salaryHistoryUtils';
import React from 'react';
import SalaryChangeBadge from './SalaryChangeBadge';

type SalaryChangeEntryProps = {
  entry: SalaryChangeLogEntry;
};

const SalaryChangeEntry: React.FC<SalaryChangeEntryProps> = ({ entry }) => {
  // Safely access changedBy properties with fallbacks
  const changedByName = entry.changedBy?.name || 'Unknown User';
  const changedByEmail = entry.changedBy?.email || 'No email available';

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <SalaryChangeBadge entry={entry} />
          </div>
          <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs text-gray-500">Changed By</div>
              <div className="font-medium text-gray-900">
                {changedByName}
              </div>
              <div className="text-xs text-gray-500">{changedByEmail}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Amount</div>
              <div className="font-medium text-blue-900">
                <span className={`font-medium ${entry.amount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatAmount(entry.amount)}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-2 text-sm text-gray-600">
            <div>
              <strong>Reason:</strong>
              {' '}
              {entry.reason}
            </div>
            {entry.period && (
              <div>
                <strong>Period:</strong>
                {' '}
                {entry.period}
              </div>
            )}
            <div>
              <strong>Date:</strong>
              {' '}
              {new Date(entry.timestamp).toLocaleDateString()}
              {' '}
              at
              {' '}
              {new Date(entry.timestamp).toLocaleTimeString()}
            </div>
            {entry.notes && (
              <div>
                <strong>Notes:</strong>
                {' '}
                {entry.notes}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(entry.timestamp).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default SalaryChangeEntry;
