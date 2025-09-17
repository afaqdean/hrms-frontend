import Image from 'next/image';
import React, { useState } from 'react';

type AvatarProps = {
  src?: string; // Optional image source, defaults to a placeholder avatar
  icon?: React.ReactNode; // Optional icon to display instead of an image
  className?: string; // Additional styling classes for customization
};

const Avatar: React.FC<AvatarProps> = ({ src = '/assets/profile_avatar_placeholder.png', icon, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasValidSrc = !!src && src !== '';

  return (
    <div className={`relative flex items-center justify-center rounded-full ${className}`}>
      {/* If an icon is provided, render the icon instead of an image */}
      {icon
        ? (
            <div className="flex items-center justify-center p-3">
              <span className="text-xl text-primary-100">{icon}</span>
            </div>
          )
        : (
            <div className="relative">
              <div className={`absolute inset-0 size-24 animate-pulse rounded-full bg-gray-200 md:size-10 ${
                imageLoaded ? 'hidden' : 'block'
              }`}
              />
              {hasValidSrc && (
                <Image
                  alt="avatar-image"
                  src={src}
                  height={96}
                  width={96}
                  className={`size-24 rounded-full object-cover transition-opacity duration-300 sm:size-10 md:size-10 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
            </div>
          )}
    </div>
  );
};

export default Avatar;
