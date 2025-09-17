import type { Metadata } from 'next';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

type SEOMetadataProps = {
  title?: string;
  description?: string;
  path: string;
  locale: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
    images?: string[];
  };
};

/**
 * Generate metadata for a page with proper SEO settings
 */
export function generateSEOMetadata({
  title,
  description,
  path,
  locale,
  openGraph,
  twitter,
}: SEOMetadataProps): Metadata {
  const baseUrl = getBaseUrl();

  // Generate canonical URL
  const canonicalPath = locale === AppConfig.defaultLocale ? path : `/${locale}${path}`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  // Generate alternate language URLs
  const alternateLanguages: Record<string, string> = {};
  AppConfig.locales.forEach((lang) => {
    const localePath = lang === AppConfig.defaultLocale ? path : `/${lang}${path}`;
    alternateLanguages[lang] = `${baseUrl}${localePath}`;
  });

  // Default title and description
  const pageTitle = title || 'HRMS - Human Resource Management System';
  const pageDescription = description || 'A comprehensive Human Resource Management System built with Next.js';

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: openGraph?.title || pageTitle,
      description: openGraph?.description || pageDescription,
      url: canonicalUrl,
      siteName: 'HRMS',
      locale,
      type: 'website',
      images: openGraph?.images?.map(image => ({
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
        width: 1200,
        height: 630,
        alt: pageTitle,
      })) || [
        {
          url: `${baseUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title || pageTitle,
      description: twitter?.description || pageDescription,
      images: twitter?.images || [`${baseUrl}/android-chrome-512x512.png`],
    },
  };
}
