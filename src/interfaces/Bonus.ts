export type BonusType = 'medical_allowance' | 'wfh_travelling_allowance' | 'house_rent_allowance' | 'bonus' | 'overtime' | 'arrears' | 'advance_salary';

export type BonusFormData = {
  employeeId: string;
  amount: string;
  period: string;
  type: string;
  reason: string;
  notes: string;
};

export type Bonus = {
  id?: string;
  _id?: string;
  employeeId: string;
  amount: number;
  period: string;
  type: BonusType;
  reason: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateBonusPayload = {
  employeeId: string;
  amount: number;
  period: string;
  type: BonusType;
  reason: string;
  notes?: string;
};
