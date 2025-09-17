import React from 'react';

type FormSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const FormSection: React.FC<FormSectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

export default FormSection;
