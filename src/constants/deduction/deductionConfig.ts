/**
 * Configuration for deduction type badges
 */
export const DEDUCTION_TYPE_BADGE_CONFIG = {
  advance_salary: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Advance Salary' },
  deal: { bg: 'bg-green-100', text: 'text-green-800', label: 'Deal' },
  trip_insurance: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Trip Insurance' },
  leave: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Leave' },
  rent: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Rent' },
  provident_fund: { bg: 'bg-pink-100', text: 'text-pink-800', label: 'Provident Fund' },
  eobi: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'EOBI' },
  tax: { bg: 'bg-red-100', text: 'text-red-800', label: 'Tax' },
} as const;

/**
 * Configuration for status badges
 */
export const STATUS_BADGE_CONFIG = {
  active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
  inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
} as const;
