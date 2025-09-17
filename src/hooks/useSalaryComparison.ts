import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type HRMSModification = {
  type: 'bonus' | 'deduction' | 'salary_increment' | 'loan';
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  period: string;
  reason: string;
  notes?: string;
  createdAt: string;
  source: string;
};

export type SalaryComparisonResult = {
  hasModifications: boolean;
  modifications: HRMSModification[];
  summary: {
    bonuses: number;
    deductions: number;
    salaryIncrements: number;
    loans: number;
    totalModifications: number;
  };
  warningMessage: string;
};

// API functions
const fetchManualHRMSModifications = async (period: string): Promise<HRMSModification[]> => {
  try {
    // Use the new optimized backend endpoint
    const response = await API.get(`/payroll/manual-data/${period}`);
    const data = response.data;

    // Extract the actual data from the response structure
    const responseData = data.data || data;

    const allModifications: HRMSModification[] = [];

    // Process bonuses
    if (responseData.bonuses && Array.isArray(responseData.bonuses)) {
      const bonuses = responseData.bonuses.map((bonus: any) => ({
        type: 'bonus' as const,
        id: bonus._id || bonus.id,
        employeeId: bonus.employeeId?.employeeID || bonus.employeeId?.cnic || bonus.employeeId || 'Unknown',
        employeeName: bonus.employeeId?.name || bonus.employeeName || 'Unknown Employee',
        amount: bonus.amount,
        period: bonus.period,
        reason: bonus.reason,
        notes: bonus.notes,
        createdAt: bonus.createdAt,
        source: bonus.source || 'manual',
      }));
      allModifications.push(...bonuses);
    }

    // Process deductions
    if (responseData.deductions && Array.isArray(responseData.deductions)) {
      const deductions = responseData.deductions.map((deduction: any) => ({
        type: 'deduction' as const,
        id: deduction._id || deduction.id,
        employeeId: deduction.employeeId?.employeeID || deduction.employeeId?.cnic || deduction.employeeId || 'Unknown',
        employeeName: deduction.employeeId?.name || deduction.employeeName || 'Unknown Employee',
        amount: deduction.amount,
        period: deduction.period,
        reason: deduction.reason,
        notes: deduction.notes,
        createdAt: deduction.createdAt,
        source: deduction.source || 'manual',
      }));
      allModifications.push(...deductions);
    }

    // Process salary increments
    if (responseData.salaryIncrements && Array.isArray(responseData.salaryIncrements)) {
      // Filter out Excel Import increments and only include manual ones
      const manualIncrements = responseData.salaryIncrements
        .filter((increment: any) =>
          increment.reason !== 'Salary Increment - Excel Import'
          && increment.isActive !== false,
        )
        .map((increment: any) => ({
          type: 'salary_increment' as const,
          id: increment._id || increment.id,
          employeeId: increment.employeeId?.employeeID || increment.employeeId?.cnic || increment.employeeId || 'Unknown',
          employeeName: increment.employeeId?.name || increment.employeeName || 'Unknown Employee',
          amount: increment.incrementAmount || increment.amount,
          period,
          reason: increment.reason,
          notes: increment.notes,
          createdAt: increment.createdAt,
          source: increment.source || 'manual',
        }));

      allModifications.push(...manualIncrements);
    }

    // Process loans
    if (responseData.loans && Array.isArray(responseData.loans)) {
      const loans = responseData.loans.map((loan: any) => ({
        type: 'loan' as const,
        id: loan._id || loan.id,
        employeeId: loan.employeeId?.employeeID || loan.employeeId?.cnic || loan.employeeId || 'Unknown',
        employeeName: loan.employeeId?.name || loan.employeeName || 'Unknown Employee',
        amount: loan.deductionPerMonth || loan.monthlyDeduction || 0,
        period,
        reason: `Loan repayment: ${loan.reason || loan.purpose || 'Loan'}`,
        notes: `Loan amount: ${loan.amount || loan.loanAmount}, Remaining: ${loan.amount || loan.loanAmount}`,
        createdAt: loan.createdAt,
        source: loan.source || 'manual',
      }));
      allModifications.push(...loans);
    }

    return allModifications;
  } catch (error) {
    console.error('Error fetching manual HRMS modifications:', error);
    throw new Error('Failed to fetch manual HRMS modifications');
  }
};

const analyzeModifications = (modifications: HRMSModification[], period: string): SalaryComparisonResult => {
  const summary = {
    bonuses: 0,
    deductions: 0,
    salaryIncrements: 0,
    loans: 0,
    totalModifications: 0,
  };

  // Count modifications by type
  modifications.forEach((mod) => {
    switch (mod.type) {
      case 'bonus':
        summary.bonuses++;
        break;
      case 'deduction':
        summary.deductions++;
        break;
      case 'salary_increment':
        summary.salaryIncrements++;
        break;
      case 'loan':
        summary.loans++;
        break;
    }
  });

  summary.totalModifications = modifications.length;

  // Generate warning message
  let warningMessage = '';
  if (summary.totalModifications > 0) {
    warningMessage = `⚠️ Warning: ${summary.totalModifications} manually entered HRMS modification(s) found for ${period} that may not be reflected in the uploaded salary file. `;
    warningMessage += `Please review: `;

    const details: string[] = [];
    if (summary.bonuses > 0) {
      details.push(`${summary.bonuses} manual bonus(es)`);
    }
    if (summary.deductions > 0) {
      details.push(`${summary.deductions} manual deduction(s)`);
    }
    if (summary.salaryIncrements > 0) {
      details.push(`${summary.salaryIncrements} manual salary increment(s)`);
    }
    if (summary.loans > 0) {
      details.push(`${summary.loans} active loan(s)`);
    }

    warningMessage += `${details.join(', ')}.`;
  }

  return {
    hasModifications: summary.totalModifications > 0,
    modifications,
    summary,
    warningMessage,
  };
};

const compareSalaryWithHRMSAPI = async (period: string): Promise<SalaryComparisonResult> => {
  // Fetch all manual HRMS modifications for the specified period
  const modifications = await fetchManualHRMSModifications(period);

  // Analyze the modifications
  const comparisonResult = analyzeModifications(modifications, period);

  return comparisonResult;
};

// React Query hooks
export const useSalaryComparison = (period: string) => {
  return useQuery({
    queryKey: ['salary-comparison', period],
    queryFn: () => compareSalaryWithHRMSAPI(period),
    enabled: !!period,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCompareSalaryWithHRMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: compareSalaryWithHRMSAPI,
    onSuccess: (_, variables) => {
      // Invalidate and refetch salary comparison for the specific period
      queryClient.invalidateQueries({ queryKey: ['salary-comparison', variables] });
      toast.success('Salary comparison completed successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (() => {
        if (error instanceof Error) {
          return error.message;
        }
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          return String(error.response.data.message);
        }
        return 'Failed to check HRMS modifications';
      })();
      toast.error(errorMessage);
    },
  });
};
