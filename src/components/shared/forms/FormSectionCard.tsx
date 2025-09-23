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
    <Card className={`bg-card shadow ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-card-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSectionCard;
