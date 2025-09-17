/* eslint-disable react-dom/no-dangerously-set-innerhtml */
/* eslint-disable react/no-unstable-default-props */
'use client';

import { getBaseUrl } from '@/utils/Helpers';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

type StructuredDataProps = {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'BreadcrumbList' | 'Person' | 'Product';
  data?: Record<string, any>;
};

export default function StructuredData({ type, data = {} }: StructuredDataProps) {
  const pathname = usePathname();
  const baseUrl = getBaseUrl();

  // Default structured data based on type
  let structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  // Add default data based on type
  switch (type) {
    case 'Organization':
      structuredData = {
        ...structuredData,
        name: 'HRMS',
        url: baseUrl,
        logo: `${baseUrl}/android-chrome-512x512.png`,
        sameAs: [
          'https://github.com/Code-Huddle',
          // Add other social media links
        ],
        ...data,
      };
      break;

    case 'WebSite':
      structuredData = {
        ...structuredData,
        name: 'HRMS - Human Resource Management System',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          'target': `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };
      break;

    case 'WebPage':
      structuredData = {
        ...structuredData,
        name: data.title || 'HRMS Page',
        description: data.description || 'Human Resource Management System',
        url: `${baseUrl}${pathname}`,
        ...data,
      };
      break;

    case 'BreadcrumbList':
      // If no items provided, create default breadcrumb based on current path
      if (!data.itemListElement) {
        const pathSegments = pathname.split('/').filter(Boolean);
        const breadcrumbItems = pathSegments.map((segment, index) => {
          const position = index + 1;
          const url = `${baseUrl}/${pathSegments.slice(0, position).join('/')}`;
          const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

          return {
            '@type': 'ListItem',
            position,
            'item': {
              '@id': url,
              name,
            },
          };
        });

        // Add home as first item if not already included
        if (pathSegments.length > 0) {
          breadcrumbItems.unshift({
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@id': baseUrl,
              'name': 'Home',
            },
          });

          // Adjust positions for other items
          for (let i = 1; i < breadcrumbItems.length; i++) {
            breadcrumbItems[i]!.position = i + 1;
          }
        }

        structuredData.itemListElement = breadcrumbItems;
      } else {
        structuredData = {
          ...structuredData,
          ...data,
        };
      }
      break;

    default:
      structuredData = {
        ...structuredData,
        ...data,
      };
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
