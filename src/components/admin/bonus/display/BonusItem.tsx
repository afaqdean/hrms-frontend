'use client';

import type { BonusType } from '@/interfaces/Bonus';
import { BONUS_TYPE_LABELS } from '@/components/admin/bonus/forms/BonusFormTypes';
import { Button } from '@/components/ui/button';
import { MdDelete } from 'react-icons/md';
import { formatDateSafely } from '../utils/bonusFormatting';

type BonusItemProps = {
  bonus: {
    id?: string;
    _id?: string;
    amount: number;
    type: BonusType;
    reason: string;
    period: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
  };
  onDelete: (bonusId: string) => void;
};

const BonusItem: React.FC<BonusItemProps> = ({ bonus, onDelete }) => {
  const bonusId = bonus.id || bonus._id;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                bonus.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {bonus.isActive ? 'Active' : 'Inactive'}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                bonus.type === 'bonus'
                  ? 'bg-green-100 text-green-800'
                  : bonus.type === 'overtime'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
              }`}
            >
              {BONUS_TYPE_LABELS[bonus.type as BonusType]}
            </span>
          </div>

          <div className="mb-2">
            <div className="font-medium text-gray-900">
              PKR
              {' '}
              {bonus.amount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {BONUS_TYPE_LABELS[bonus.type as BonusType]}
              {' '}
              Bonus
            </div>
          </div>

          <div className="mb-2 text-sm text-gray-600">
            <div>
              <strong>Reason:</strong>
              {' '}
              {bonus.reason}
            </div>
            <div>
              <strong>Effective Period:</strong>
              {' '}
              {formatDateSafely(bonus.period)}
            </div>
          </div>

          {bonus.notes && (
            <div className="text-sm text-gray-500">
              <strong>Notes:</strong>
              {' '}
              {bonus.notes}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">
            {formatDateSafely(bonus.createdAt, {})}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => bonusId && onDelete(bonusId)}
            className="text-red-500 hover:text-red-600"
            disabled={!bonusId}
          >
            <MdDelete className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BonusItem;
