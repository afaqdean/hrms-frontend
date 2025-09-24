'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrandingContext } from '@/context/useBrandingContext';
import React from 'react';

const BrandingTest: React.FC = () => {
  const { branding, applyBranding, resetToDefault } = useBrandingContext();

  const testBranding = {
    id: 'test',
    companyId: 'test',
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    backgroundColor: '#F7F7F7',
    logoUrl: 'https://via.placeholder.com/150x50/FF6B6B/FFFFFF?text=Test+Logo',
    logoAltText: 'Test Company Logo',
    fontFamily: 'Inter',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Branding Test</CardTitle>
        <CardDescription>
          Test the branding system with sample data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Current Branding:</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Primary:</span>
              {' '}
              {branding?.primaryColor || 'Default'}
            </p>
            <p>
              <span className="font-semibold">Secondary:</span>
              {' '}
              {branding?.secondaryColor || 'Default'}
            </p>
            <p>
              <span className="font-semibold">Background:</span>
              {' '}
              {branding?.backgroundColor || 'Default'}
            </p>
            <p>
              <span className="font-semibold">Font:</span>
              {' '}
              {branding?.fontFamily || 'Default'}
            </p>
            <p>
              <span className="font-semibold">Logo:</span>
              {' '}
              {branding?.logoUrl ? 'Custom' : 'Default'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => applyBranding(testBranding)}
            className="text-white"
            style={{
              backgroundColor: testBranding.primaryColor,
            }}
          >
            Apply Test Branding
          </Button>
          <Button
            onClick={resetToDefault}
            variant="outline"
          >
            Reset to Default
          </Button>
        </div>

        <div
          className="rounded border p-4"
          style={{
            backgroundColor: branding?.backgroundColor || '#FFFFFF',
            color: branding?.primaryColor || '#000000',
            fontFamily: branding?.fontFamily || 'Poppins',
          }}
        >
          <h3 className="mb-2 font-bold">Sample Content</h3>
          <p className="text-sm">
            This content uses the current branding colors and font.
          </p>
          <div
            className="mt-2 rounded p-2"
            style={{
              backgroundColor: branding?.secondaryColor || '#F4F5F7',
            }}
          >
            Secondary background color
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingTest;
