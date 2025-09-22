'use client';

import { useBrandingContext } from '@/context/BrandingContext';
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

  // Use company logo if available, otherwise fall back to default
  const logoSrc = branding?.logoUrl || huddleHRLogo.src;
  const logoAlt = branding?.logoAltText || 'Company Logo';

  return (
    <Image
      src={logoSrc}
      height={height}
      width={width}
      className={className}
      alt={logoAlt}
      onClick={onClick}
    />
  );
};

export default DynamicLogo;
