'use client';

import DeductionCard from './DeductionCard';

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

type DeductionsListProps = {
  deductions: Deduction[];
  loading: boolean;
  onDeleteDeduction: (deductionId: string) => void;
};

const DeductionsList: React.FC<DeductionsListProps> = ({
  deductions,
  loading,
  onDeleteDeduction,
}) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Employee Deductions</h2>

      {loading
        ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading deductions...</div>
            </div>
          )
        : deductions && deductions.length > 0
          ? (
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {deductions.map(deduction => (
                  <DeductionCard
                    key={deduction._id}
                    deduction={deduction}
                    onDelete={onDeleteDeduction}
                  />
                ))}
              </div>
            )
          : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mb-2 text-4xl text-gray-400"></div>
                  <div className="text-gray-500">No deductions found</div>
                  <div className="mt-1 text-sm text-gray-400">
                    Deduction history will appear here once deductions are created
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default DeductionsList;
