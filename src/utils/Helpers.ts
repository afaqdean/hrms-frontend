import { format, isValid, parseISO } from 'date-fns';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

/**
 * Generate a canonical URL for the current page
 * @param path - The current path
 * @returns The canonical URL
 */
export const getCanonicalUrl = (path: string) => {
  const baseUrl = getBaseUrl();

  // Remove trailing slash except for the homepage
  const normalizedPath = path === '' || path === '/'
    ? '/'
    : path.endsWith('/')
      ? path.slice(0, -1)
      : path;

  return `${baseUrl}${normalizedPath}`;
};

/**
 * Format a date to MM/DD/YYYY string using date-fns
 * @param date - Date object or date string
 * @returns Formatted date string in MM/DD/YYYY format
 */
export const formatDate = (date: Date | string): string => {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return '';
  }

  return format(dateObj, 'MM/dd/yyyy');
};
