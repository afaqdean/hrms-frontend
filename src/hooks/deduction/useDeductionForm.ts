import type { CreateDeductionPayload, DeductionFormData, DeductionType } from '@/interfaces/Deduction';
import { DEDUCTION_TYPES } from '@/constants/deduction/deductionTypes';
import { useCreateDeduction } from '@/hooks';
import { createMonthPeriod, validateDeductionForm } from '@/utils/deduction/deductionValidation';
import { useEffect, useState } from 'react';

type UseDeductionFormProps = {
  employeeId: string;
  onSuccess?: () => void;
};

export const useDeductionForm = ({ employeeId, onSuccess }: UseDeductionFormProps) => {
  const { mutateAsync: createDeduction, isPending: loading } = useCreateDeduction();

  const [formData, setFormData] = useState<DeductionFormData>({
    employeeId: '',
    amount: '',
    period: new Date().toISOString().split('T')[0] || '',
    type: DEDUCTION_TYPES[0]?.value ?? 'tax',
    reason: '',
    notes: '',
  });

  const [effectiveMonth, setEffectiveMonth] = useState(new Date());

  // Update employeeId when it becomes available
  useEffect(() => {
    if (employeeId) {
      setFormData(prev => ({ ...prev, employeeId }));
    }
  }, [employeeId]);

  const handleInputChange = (field: keyof DeductionFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDeductionForm(formData)) {
      return;
    }

    try {
      // Format as YYYY-MM (month period, not specific date)
      const monthPeriod = createMonthPeriod(effectiveMonth);

      const payload: CreateDeductionPayload = {
        employeeId: formData.employeeId,
        amount: Number.parseFloat(formData.amount),
        period: monthPeriod,
        type: formData.type as DeductionType,
        reason: formData.reason.trim(),
        notes: formData.notes.trim() || undefined,
      };

      await createDeduction(payload);
      onSuccess?.();
    } catch (err: any) {
      console.error('Failed to create deduction:', err);
    }
  };

  return {
    formData,
    effectiveMonth,
    loading,
    handleInputChange,
    handleSubmit,
    setEffectiveMonth,
  };
};
