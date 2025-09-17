import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import { getBadgeConfig } from '@/components/admin/payroll/shared/BadgeConfig';
import { Badge } from '@/components/ui/badge';
import React from 'react';

type SalaryChangeTypeBadgeProps = {
  entry: SalaryChangeLogEntry;
};

const SalaryChangeTypeBadge: React.FC<SalaryChangeTypeBadgeProps> = ({ entry }) => {
  const baseConfig = getBadgeConfig(entry.type, 'salary');
  const getTypeDetails = () => {
    if (entry.type === 'salary_increment' && entry.incrementType) {
      return (
        <Badge variant="success" className="ml-2 bg-green-50 text-green-700">
          {entry.incrementType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      );
    } else if (entry.type === 'bonus' && entry.bonusType) {
      return (
        <Badge variant="info" className="ml-2 bg-blue-50 text-blue-700">
          {entry.bonusType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      );
    } else if (entry.type === 'deduction' && entry.deductionType) {
      return (
        <Badge variant="danger" className="ml-2 bg-red-50 text-red-700">
          {entry.deductionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Badge variant={baseConfig.variant}>
        {baseConfig.emoji}
        {' '}
        {baseConfig.label}
      </Badge>
      {getTypeDetails()}
    </div>
  );
};

export default SalaryChangeTypeBadge;
