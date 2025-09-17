import type { BonusType } from '@/interfaces/Bonus';

export const BONUS_TYPES = [
  { value: 'medical_allowance' as BonusType, label: 'Medical Allowance' },
  { value: 'wfh_travelling_allowance' as BonusType, label: 'WFH/Travelling Allowance' },
  { value: 'house_rent_allowance' as BonusType, label: 'House Rent Allowance' },
  { value: 'bonus' as BonusType, label: 'Bonus' },
  { value: 'overtime' as BonusType, label: 'Overtime' },
  { value: 'arrears' as BonusType, label: 'Arrears' },
  { value: 'advance_salary' as BonusType, label: 'Advance Salary' },
];

export const BONUS_TYPE_LABELS: Record<BonusType, string> = {
  medical_allowance: 'Medical Allowance',
  wfh_travelling_allowance: 'WFH/Travelling Allowance',
  house_rent_allowance: 'House Rent Allowance',
  bonus: 'Bonus',
  overtime: 'Overtime',
  arrears: 'Arrears',
  advance_salary: 'Advance Salary',
};

export type AddBonusFormProps = {
  employeeId: string;
  onSuccess: () => void;
  onBonusCreated: () => Promise<void>;
};
