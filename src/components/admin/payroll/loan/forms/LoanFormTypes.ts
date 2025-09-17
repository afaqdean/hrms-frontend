export type LoanEditFormData = {
  amount: string;
  installments: string;
  reason: string;
  status: string;
  adminRemarks: string;
};

export type LoanFormFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export type LoanFormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  disabled?: boolean;
};
