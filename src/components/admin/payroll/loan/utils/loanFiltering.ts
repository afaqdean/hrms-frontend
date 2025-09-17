import type { LoanRequest } from '@/interfaces/LoanRequest';
import { LOAN_STATUS_PRIORITY } from './loanConstants';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

// Type guard to check if employeeId is a populated object with _id
const isPopulatedEmployeeId = (employeeId: unknown): employeeId is { _id: string } => {
  return typeof employeeId === 'object' && employeeId !== null && '_id' in employeeId;
};

/**
 * Filter loans by employee ID
 */
export const filterByEmployee = (loans: LoanRequest[], employeeId: string): LoanRequest[] => {
  return loans.filter((loan) => {
    // Handle both cases: employeeId as string or as populated object
    if (isPopulatedEmployeeId(loan.employeeId)) {
      // If employeeId is an object (populated), compare with its _id
      return loan.employeeId._id === employeeId;
    } else {
      // If employeeId is a string, compare directly
      return loan.employeeId === employeeId;
    }
  });
};

/**
 * Filter loans by status
 */
export const filterByStatus = (loans: LoanRequest[], statusFilter: string): LoanRequest[] => {
  if (statusFilter === 'All') {
    return loans;
  }
  return loans.filter(loan => loan.status === statusFilter);
};

/**
 * Filter loans by source
 */
export const filterBySource = (loans: LoanRequest[], sourceFilter: string): LoanRequest[] => {
  if (sourceFilter === 'All') {
    return loans;
  }
  return loans.filter(loan => loan.source === sourceFilter);
};

/**
 * Filter loans by search query
 */
export const filterBySearchQuery = (loans: LoanRequest[], searchQuery: string): LoanRequest[] => {
  if (!searchQuery) {
    return loans;
  }

  const query = searchQuery.toLowerCase();
  return loans.filter(loan =>
    (loan.employeeName?.toLowerCase() || '').includes(query)
    || (loan.employeeEmail?.toLowerCase() || '').includes(query)
    || loan.reason.toLowerCase().includes(query)
    || loan.amount.toString().includes(query),
  );
};

/**
 * Filter loans by date range (month-based)
 */
export const filterByDateRange = (loans: LoanRequest[], dateRange: DateRange): LoanRequest[] => {
  if (!dateRange.from && !dateRange.to) {
    return loans;
  }

  return loans.filter((loan) => {
    const requestDate = new Date(loan.requestedAt);
    const requestYear = requestDate.getFullYear();
    const requestMonth = requestDate.getMonth();

    if (dateRange.from && dateRange.to) {
      const fromYear = dateRange.from.getFullYear();
      const fromMonth = dateRange.from.getMonth();
      const toYear = dateRange.to.getFullYear();
      const toMonth = dateRange.to.getMonth();

      return (
        (requestYear > fromYear || (requestYear === fromYear && requestMonth >= fromMonth))
        && (requestYear < toYear || (requestYear === toYear && requestMonth <= toMonth))
      );
    } else if (dateRange.from) {
      const fromYear = dateRange.from.getFullYear();
      const fromMonth = dateRange.from.getMonth();
      return requestYear > fromYear || (requestYear === fromYear && requestMonth >= fromMonth);
    } else if (dateRange.to) {
      const toYear = dateRange.to.getFullYear();
      const toMonth = dateRange.to.getMonth();
      return requestYear < toYear || (requestYear === toYear && requestMonth <= toMonth);
    }

    return true;
  });
};

/**
 * Sort loans by status priority and date
 */
export const sortLoansByPriority = (loans: LoanRequest[]): LoanRequest[] => {
  return loans.sort((a, b) => {
    const statusPriority = LOAN_STATUS_PRIORITY[a.status] - LOAN_STATUS_PRIORITY[b.status];
    if (statusPriority !== 0) {
      return statusPriority;
    }

    // If same status, sort by date (newest first)
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });
};

/**
 * Apply all filters and sorting to loan requests
 */
export const filterAndSortLoans = (
  loans: LoanRequest[],
  filters: {
    employeeId?: string;
    statusFilter: string;
    sourceFilter: string;
    searchQuery: string;
    dateRange: DateRange;
  },
): LoanRequest[] => {
  let filtered = loans;

  // Apply filters in sequence
  if (filters.employeeId) {
    filtered = filterByEmployee(filtered, filters.employeeId);
  }

  filtered = filterByStatus(filtered, filters.statusFilter);
  filtered = filterBySource(filtered, filters.sourceFilter);
  filtered = filterBySearchQuery(filtered, filters.searchQuery);
  filtered = filterByDateRange(filtered, filters.dateRange);

  // Apply sorting
  return sortLoansByPriority(filtered);
};
