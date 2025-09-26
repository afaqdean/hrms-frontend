'use client';

import { useBrandingContext } from '@/context/useBrandingContext';
import Image from 'next/image';
import huddleHRLogo from 'public/assets/huddle-image.png';
import React from 'react';

type DynamicLogoProps = {
  height?: number;
  width?: number;
  className?: string;
  onClick?: () => void;
};

const DynamicLogo: React.FC<DynamicLogoProps> = ({
  height = 50,
  width = 150,
  className = 'cursor-pointer object-contain',
  onClick,
}) => {
  const { branding } = useBrandingContext();

  // Check if custom logo is available
  const hasCustomLogo = branding?.logoUrl;
  const logoAlt = branding?.logoAltText || 'Company Logo';

  return (
    <div
      className="flex cursor-pointer items-center gap-3"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {hasCustomLogo && branding.logoUrl
        ? (
            <>
              {/* Custom Logo */}
              <Image
                src={branding.logoUrl}
                height={height}
                width={height} // Make it square for the logo
                className="object-contain"
                alt={logoAlt}
              />
              {/* HuddleHR Text */}
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">HuddleHR</span>
              </div>
            </>
          )
        : (
            /* Default Logo (includes text) */
            <Image
              src={huddleHRLogo.src}
              height={height}
              width={width}
              className={className}
              alt="HuddleHR Logo"
            />
          )}
    </div>
  );
};

export default DynamicLogo;
