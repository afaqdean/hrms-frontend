import { Input } from '@/components/ui/input';
import React from 'react';

type SubdomainInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  parentDivClasses?: string;
  error?: string;
  isChecking?: boolean;
  isAvailable?: boolean | null;
  availabilityError?: string;
};

const SubdomainInput: React.FC<SubdomainInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  parentDivClasses = '',
  error,
  isChecking = false,
  isAvailable = null,
  availabilityError,
}) => {
  return (
    <div className={`w-full ${parentDivClasses}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <Input
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${error ? 'border-red-500' : ''} ${className}`}
          parentDivClasses=""
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
          .hr-ify.com
        </span>
      </div>

      {/* Availability Status */}
      {isChecking && (
        <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
      )}
      {!isChecking && value && isAvailable !== null && (
        <p className={`mt-1 text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {isAvailable ? '✓ Available' : '✗ Not available'}
        </p>
      )}
      {availabilityError && (
        <p className="mt-1 text-sm text-red-600">
          Error checking subdomain:
          {' '}
          {availabilityError}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SubdomainInput;
