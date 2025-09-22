import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

type FormSectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
};

const FormSectionCard: React.FC<FormSectionCardProps> = ({
  title,
  children,
  className = '',
  description,
}) => {
  return (
    <Card className={`bg-white shadow ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          {title}
        </CardTitle>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSectionCard;
