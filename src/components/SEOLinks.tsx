'use client';

import { getCanonicalUrl } from '@/utils/Helpers';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

type SEOLinksProps = {
  path?: string; // Optional override for the current path
};

export default function SEOLinks({ path }: SEOLinksProps) {
  const pathname = usePathname();

  // Use the current path or the provided path
  const currentPath = path || pathname;

  // Generate canonical URL
  const canonicalUrl = getCanonicalUrl(currentPath);

  // Create a script to inject the links since Next.js App Router doesn't support
  // direct manipulation of head links in client components
  const linkTags = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
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
