export type IncrementType = 'salary_increment' | 'promotion' | 'performance_bonus' | 'cost_of_living' | 'other';

export type SalaryIncrementFormData = {
  employeeId: string;
  amount: string; // Amount to add (e.g., "7500")
  percentage?: string; // Percentage to add (e.g., "10.5")
  reason: string;
  period: string; // Period in YYYY-MM format
  type: IncrementType;
  notes: string;
  incrementType?: 'amount' | 'percentage'; // Type of increment input
  calculatedSalary?: string; // Calculated new salary
  effectiveDate?: string; // Effective date for the increment
};

export type SalaryIncrement = {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
    employeeID: string;
  };
  amount: number;
  reason: string;
  period: string;
  type: IncrementType;
  addedBy: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSalaryIncrementPayload = {
  amount: number;
  reason: string;
  period: string;
  type: IncrementType;
  notes?: string;
};

export type UpdateSalaryIncrementPayload = {
  amount?: number;
  reason?: string;
  period?: string;
  type?: IncrementType;
  notes?: string;
  isActive?: boolean;
};

export type SalaryChangeLogEntry = {
  _id: string;
  type: 'salary_increment' | 'bonus' | 'deduction';
  timestamp: string;
  changedBy: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  reason: string;
  notes?: string;
  // ID fields for each type
  incrementId?: string;
  bonusId?: string;
  deductionId?: string;
  // Period field (YYYY-MM format)
  period?: string;
  // Type-specific fields
  incrementType?: string;
  bonusType?: string;
  deductionType?: string;
  // Source field for bonus/deduction
  source?: string;
  // Additional fields for display
  previousSalary?: number;
  newSalary?: number;
};
