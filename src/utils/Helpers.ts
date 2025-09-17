import { routing } from '@/libs/i18nNavigation';
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

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

/**
 * Generate a canonical URL for the current page
 * @param path - The current path (without locale)
 * @param locale - The current locale
 * @returns The canonical URL
 */
export const getCanonicalUrl = (path: string, locale: string) => {
  const baseUrl = getBaseUrl();
  const canonicalPath = locale === routing.defaultLocale ? path : `/${locale}${path}`;

  // Remove trailing slash except for the homepage
  const normalizedPath = canonicalPath === '' || canonicalPath === '/'
    ? '/'
    : canonicalPath.endsWith('/')
      ? canonicalPath.slice(0, -1)
      : canonicalPath;

  return `${baseUrl}${normalizedPath}`;
};

/**
 * Generate alternate language URLs for hreflang tags
 * @param path - The current path (without locale)
 * @returns An array of alternate language URLs
 */
export const getAlternateLanguageUrls = (path: string) => {
  const baseUrl = getBaseUrl();

  return routing.locales.map((locale) => {
    const localePath = locale === routing.defaultLocale ? path : `/${locale}${path}`;

    // Remove trailing slash except for the homepage
    const normalizedPath = localePath === '' || localePath === '/'
      ? '/'
      : localePath.endsWith('/')
        ? localePath.slice(0, -1)
        : localePath;

    return {
      locale,
      url: `${baseUrl}${normalizedPath}`,
    };
  });
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
