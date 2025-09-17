import { MultiStepFormContext } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import { useContext } from 'react';

// Hook to use the context
export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);

  if (!context) {
    console.error(
      'useMultiStepForm must be used within a MultiStepFormProvider. '
      + 'Check that you have wrapped your component tree with MultiStepFormProvider.',
    );
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }

  return context;
};
