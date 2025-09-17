import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import React from 'react';
import SalaryChangeSourceBadge from './SalaryChangeSourceBadge';
import SalaryChangeTypeBadge from './SalaryChangeTypeBadge';

type SalaryChangeBadgeProps = {
  entry: SalaryChangeLogEntry;
};

const SalaryChangeBadge: React.FC<SalaryChangeBadgeProps> = ({ entry }) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <SalaryChangeTypeBadge entry={entry} />
      <SalaryChangeSourceBadge entry={entry} />
    </div>
  );
};

export default SalaryChangeBadge;
