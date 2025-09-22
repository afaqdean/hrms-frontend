import { Input } from '@/components/ui/input';
import React from 'react';

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  parentDivClasses?: string;
  error?: string;
  helpText?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  parentDivClasses = '',
  error,
  helpText,
}) => {
  return (
    <div className={`w-full ${parentDivClasses}`}>
      <Input
        label={label}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`${error ? 'border-red-500' : ''} ${className}`}
        parentDivClasses=""
      />
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
