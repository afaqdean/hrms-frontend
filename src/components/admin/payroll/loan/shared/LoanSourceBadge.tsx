import { getBadgeConfig } from '@/components/admin/payroll/shared/BadgeConfig';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, UserPlus } from 'lucide-react';
import React from 'react';

type LoanSource = 'manual' | 'excel_import';

type LoanSourceBadgeProps = {
  source: LoanSource;
  className?: string;
  showIcon?: boolean;
};

const LoanSourceBadge: React.FC<LoanSourceBadgeProps> = ({
  source,
  className = '',
  showIcon = true,
}) => {
  const sourceConfig = getBadgeConfig(source, 'source');

  const getSourceIcon = (source: LoanSource) => {
    switch (source) {
      case 'manual':
        return <UserPlus className="size-3" />;
      case 'excel_import':
        return <FileSpreadsheet className="size-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant={sourceConfig.variant} className={`gap-1 ${className}`}>
      {showIcon && getSourceIcon(source)}
      {sourceConfig.label}
    </Badge>
  );
};

export default LoanSourceBadge;
