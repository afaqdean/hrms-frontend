/**
 * Week utility functions for time tracking components
 * Contains common logic for week calculations and formatting
 */

/**
 * Helper function to get the start of the week (Monday) for a given date
 * @param date - The date to get the week start for
 * @returns Date object representing the Monday of that week
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Helper function to format week range for display
 * @param weekStart - The Monday date of the week
 * @returns Formatted string like "01 Jan - 05 Jan 2024"
 */
export const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4); // Friday (5 working days)

  const startStr = weekStart.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
  const endStr = weekEnd.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `${startStr} - ${endStr}`;
};

/**
 * Helper function to check if two dates are in the same week
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns Boolean indicating if dates are in the same week
 */
export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const week1Start = getWeekStart(date1);
  const week2Start = getWeekStart(date2);
  return week1Start.getTime() === week2Start.getTime();
};

/**
 * Helper function to get week number of the year
 * @param date - The date to get week number for
 * @returns Week number (1-53)
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
