'use client';

import { Button } from '@/components/ui/button';
import { getDeductionTypeLabel } from '@/constants/deduction/deductionTypes';
import { formatAmount, formatMonthYear, getStatusBadgeConfig, getTypeBadgeConfig } from '@/utils/deduction/deductionFormatting';
import { MdDelete } from 'react-icons/md';

type Deduction = {
  _id: string;
  amount: number;
  type: string;
  reason: string;
  period: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
};

type DeductionCardProps = {
  deduction: Deduction;
  onDelete: (deductionId: string) => void;
};

const DeductionCard: React.FC<DeductionCardProps> = ({ deduction, onDelete }) => {
  const statusConfig = getStatusBadgeConfig(deduction.isActive);
  const typeConfig = getTypeBadgeConfig(deduction.type);

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}>
              {typeConfig.label}
            </span>
          </div>
          <div className="mb-2">
            <div className="font-medium text-gray-900">
              {formatAmount(deduction.amount)}
            </div>
            <div className="text-sm text-gray-600">
              {getDeductionTypeLabel(deduction.type)}
            </div>
          </div>
          <div className="mb-2 text-sm text-gray-600">
            <div>
              <strong>Reason:</strong>
              {' '}
              {deduction.reason}
            </div>
            <div>
              <strong>Effective Period:</strong>
              {' '}
              {formatMonthYear(deduction.period)}
            </div>
          </div>
          {deduction.notes && (
            <div className="text-sm text-gray-500">
              <strong>Notes:</strong>
              {' '}
              {deduction.notes}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">
            {new Date(deduction.createdAt).toLocaleDateString()}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(deduction._id)}
            className="text-red-500 hover:text-red-600"
          >
            <MdDelete className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeductionCard;
