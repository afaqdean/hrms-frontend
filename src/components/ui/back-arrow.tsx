import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type BackArrowProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
};

const BackArrow: React.FC<BackArrowProps> = ({
  href,
  onClick,
  className = '',
  size = 'default',
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 ${className}`}
      aria-label="Go back"
    >
      <ChevronLeft className={sizeClasses[size]} />
    </button>
  );
};

export default BackArrow;
