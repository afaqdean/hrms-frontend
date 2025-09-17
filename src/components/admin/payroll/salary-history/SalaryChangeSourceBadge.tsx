import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import { getBadgeConfig } from '@/components/admin/payroll/shared/BadgeConfig';
import { Badge } from '@/components/ui/badge';
import React from 'react';

type SalaryChangeSourceBadgeProps = {
  entry: SalaryChangeLogEntry;
};

const SalaryChangeSourceBadge: React.FC<SalaryChangeSourceBadgeProps> = ({ entry }) => {
  // Only show source badge for bonus or deduction types
  if ((entry.type !== 'bonus' && entry.type !== 'deduction') || !entry.source) {
    return null;
  }

  const sourceConfig = getBadgeConfig(entry.source, 'source');

  return (
    <Badge variant="gray" className="ml-2">
      {sourceConfig.label}
    </Badge>
  );
};

export default SalaryChangeSourceBadge;
