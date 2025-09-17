import { getBadgeConfig } from '@/components/admin/payroll/shared/BadgeConfig';
import { Badge } from '@/components/ui/badge';
import React from 'react';

type LoanStatus = 'Pending' | 'Approved' | 'Declined';

type LoanStatusBadgeProps = {
  status: LoanStatus;
  className?: string;
};

const LoanStatusBadge: React.FC<LoanStatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = getBadgeConfig(status, 'loan');

  return (
    <Badge variant={statusConfig.variant} className={className}>
      {statusConfig.label}
    </Badge>
  );
};

export default LoanStatusBadge;
