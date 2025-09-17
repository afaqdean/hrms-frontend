export type DeductionType =
  | 'advance_salary'
  | 'deal'
  | 'trip_insurance'
  | 'leave'
  | 'rent'
  | 'provident_fund'
  | 'eobi'
  | 'tax';

export type DeductionFormData = {
  employeeId: string;
  amount: string;
  period: string;
  type: string;
  reason: string;
  notes: string;
};

export type Deduction = {
  _id: string;
  employeeId: string;
  amount: number;
  period: string;
  type: DeductionType;
  reason: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateDeductionPayload = {
  employeeId: string;
  amount: number;
  period: string;
  type: DeductionType;
  reason: string;
  notes?: string;
};
