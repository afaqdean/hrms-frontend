import type { DeductionFormData } from '@/interfaces/Deduction';

export type DeductionFormProps = {
  formData: DeductionFormData;
  onInputChange: (field: keyof DeductionFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  effectiveMonth: Date;
  onEffectiveMonthChange: (date: Date) => void;
  loading?: boolean;
};
