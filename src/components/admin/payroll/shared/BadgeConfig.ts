// Centralized configuration for payroll badge types
export type PayrollBadgeType =
  | 'salary_increment' | 'bonus' | 'deduction' | 'loan'
  | 'Pending' | 'Approved' | 'Declined'
  | 'manual' | 'excel_import' | 'excel';

export type PayrollBadgeVariant =
  | 'success' | 'warning' | 'info' | 'danger' | 'gray' | 'purple';

export type BadgeConfig = {
  variant: PayrollBadgeVariant;
  label: string;
  emoji?: string;
};

// Salary change type badges
export const SALARY_CHANGE_BADGES: Record<string, BadgeConfig> = {
  salary_increment: {
    variant: 'success',
    label: 'Salary Increment',
  },
  bonus: {
    variant: 'info',
    label: 'Bonus',
  },
  deduction: {
    variant: 'danger',
    label: 'Deduction',
    emoji: '➖',
  },
};

// Loan status badges
export const LOAN_STATUS_BADGES: Record<string, BadgeConfig> = {
  Pending: {
    variant: 'warning',
    label: 'Pending',
  },
  Approved: {
    variant: 'success',
    label: 'Approved',
  },
  Declined: {
    variant: 'danger',
    label: 'Declined',
  },
};

// Source badges
export const SOURCE_BADGES: Record<string, BadgeConfig> = {
  manual: {
    variant: 'info',
    label: 'Manual',
  },
  excel_import: {
    variant: 'purple',
    label: 'Excel Import',
  },
  excel: {
    variant: 'purple',
    label: 'Excel',
  },
};

// Helper function to get badge config
export const getBadgeConfig = (type: string, category: 'salary' | 'loan' | 'source'): BadgeConfig => {
  switch (category) {
    case 'salary':
      return SALARY_CHANGE_BADGES[type] || { variant: 'gray', label: 'Unknown' };
    case 'loan':
      return LOAN_STATUS_BADGES[type] || { variant: 'gray', label: 'Unknown' };
    case 'source':
      return SOURCE_BADGES[type] || { variant: 'gray', label: 'Unknown' };
    default:
      return { variant: 'gray', label: 'Unknown' };
  }
};
