import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

// Define all the routes in the application
const routes = [
  // Public routes
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/sign-in', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/sign-up', changeFrequency: 'monthly', priority: 0.8 },

  // Dashboard routes
  { path: '/dashboard', changeFrequency: 'daily', priority: 0.9 },
  { path: '/dashboard/user-profile', changeFrequency: 'weekly', priority: 0.7 },

  // Employee routes
  { path: '/dashboard/employee', changeFrequency: 'daily', priority: 0.8 },
  { path: '/dashboard/employee/attendance', changeFrequency: 'daily', priority: 0.7 },
  { path: '/dashboard/employee/leave', changeFrequency: 'daily', priority: 0.7 },
  { path: '/dashboard/employee/payroll', changeFrequency: 'monthly', priority: 0.7 },

  // Admin routes - lower priority as they're less frequently accessed by regular users
  { path: '/dashboard/admin', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/dashboard/admin/employees', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/dashboard/admin/departments', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/dashboard/admin/settings', changeFrequency: 'monthly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // Generate sitemap entries for all locales and routes
  const sitemap: MetadataRoute.Sitemap = [];

  // Add entries for each locale
  AppConfig.locales.forEach((locale) => {
    routes.forEach(({ path, changeFrequency, priority }) => {
      // Skip default locale prefix as it's handled by as-needed config
      const localePath = locale === AppConfig.defaultLocale
        ? path
        : `/${locale}${path}`;

      sitemap.push({
        url: `${baseUrl}${localePath}`,
        lastModified: currentDate,
        changeFrequency: changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
        priority,
      });
    });
  });

  return sitemap;
}
