/**
 * Safe date formatting function for bonus periods and dates
 */
export const formatDateSafely = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' },
): string => {
  try {
    // Handle month periods (YYYY-MM format)
    if (dateString && dateString.match(/^\d{4}-\d{2}$/)) {
      const parts = dateString.split('-');
      if (parts.length === 2 && parts[0] && parts[1]) {
        const year = Number.parseInt(parts[0], 10);
        const month = Number.parseInt(parts[1], 10);
        const monthIndex = month - 1; // Month is 0-indexed
        const date = new Date(year, monthIndex, 1);
        return date.toLocaleDateString('en-US', options);
      }
    }

    // Handle full dates (YYYY-MM-DD format) as fallback
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateString);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', options);
      }
    }

    // Handle invalid or missing data
    if (!dateString || dateString === 'Invalid Date') {
      return 'No Period Set';
    }

    // Try to parse as regular date (fallback)
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return `Invalid Period (${dateString})`;
    }

    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return `Error: ${dateString}`;
  }
};
