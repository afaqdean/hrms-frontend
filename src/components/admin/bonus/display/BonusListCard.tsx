'use client';

import type { BonusType } from '@/interfaces/Bonus';
import BonusItem from './BonusItem';

type BonusData = {
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

type BonusListCardProps = {
  bonuses: BonusData[];
  isLoading: boolean;
  onDeleteBonus: (bonusId: string) => void;
};

const BonusListCard: React.FC<BonusListCardProps> = ({
  bonuses,
  isLoading,
  onDeleteBonus,
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Employee Bonuses</h2>

      {isLoading
        ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading bonuses...</div>
            </div>
          )
        : bonuses && bonuses.length > 0
          ? (
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {bonuses.map(bonus => (
                  <BonusItem
                    key={bonus.id || bonus._id || `bonus-${bonus.amount}-${bonus.period}`}
                    bonus={bonus}
                    onDelete={onDeleteBonus}
                  />
                ))}
              </div>
            )
          : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mb-2 text-4xl text-gray-400"></div>
                  <div className="text-gray-500">No bonuses found</div>
                  <div className="mt-1 text-sm text-gray-400">
                    Bonus history will appear here once bonuses are created
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default BonusListCard;
