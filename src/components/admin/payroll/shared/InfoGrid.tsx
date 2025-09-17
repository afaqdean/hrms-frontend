import React from 'react';

type InfoField = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

type InfoGridProps = {
  fields: InfoField[];
  columns?: 1 | 2 | 3;
  className?: string;
  fieldClassName?: string;
};

const InfoGrid: React.FC<InfoGridProps> = ({
  fields,
  columns = 2,
  className = '',
  fieldClassName = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {fields.map(field => (
        <div key={field.label} className={`${fieldClassName}`}>
          <div className="text-sm font-medium text-gray-600">{field.label}</div>
          <div className={`text-sm text-gray-900 ${field.className || ''}`}>
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;
