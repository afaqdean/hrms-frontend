'use client';

import { getAlternateLanguageUrls, getCanonicalUrl } from '@/utils/Helpers';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

type SEOLinksProps = {
  path?: string; // Optional override for the current path
};

export default function SEOLinks({ path }: SEOLinksProps) {
  const pathname = usePathname();
  const locale = useLocale();

  // Extract the path without locale prefix
  const currentPath = path || pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');

  // Generate canonical URL
  const canonicalUrl = getCanonicalUrl(currentPath, locale);

  // Generate alternate language URLs
  const alternateUrls = getAlternateLanguageUrls(currentPath);

  // Create a script to inject the links since Next.js App Router doesn't support
  // direct manipulation of head links in client components
  const linkTags = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    ...alternateUrls.map(({ locale, url }) =>
      `<link rel="alternate" hrefLang="${locale}" href="${url}" />`,
    ),
    `<link rel="alternate" hrefLang="x-default" href="${getCanonicalUrl(currentPath, 'en')}" />`,
  ].join('');

  const scriptContent = `
    (function() {
      const links = ${JSON.stringify(linkTags)};
      document.head.insertAdjacentHTML('beforeend', links);
    })();
  `;

  return (
    <Script id="seo-links" strategy="afterInteractive">
      {scriptContent}
    </Script>
  );
}
