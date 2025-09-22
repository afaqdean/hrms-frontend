'use client';

import BrandingTest from '@/components/admin/branding/BrandingTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/useTenant';
import { useBranding } from '@/hooks/useBranding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as LucideImage, Palette, RotateCcw, Save, Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const brandingSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  backgroundColor: z.string().min(1, 'Background color is required'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  logoAltText: z.string().optional(),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  fontFamily: z.string().min(1, 'Font family is required'),
});

type BrandingFormData = z.infer<typeof brandingSchema>;

const BrandingManagement: React.FC = () => {
  const { userData } = useAuth();
  const { tenantType, companyId } = useTenant();
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  const {
    branding,
    isLoading,
    createBranding,
    updateBranding,
    isUpdating,
  } = useBranding();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: '#11121A',
      secondaryColor: '#F4F5F7',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Poppins',
    },
  });

  // Watch form values for live preview
  const watchedValues = watch();

  // Reset form when branding data loads
  React.useEffect(() => {
    if (branding) {
      reset({
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        backgroundColor: branding.backgroundColor,
        logoUrl: branding.logoUrl || '',
        logoAltText: branding.logoAltText || '',
        faviconUrl: branding.faviconUrl || '',
        fontFamily: branding.fontFamily,
      });

      if (branding.logoUrl) {
        setLogoPreview(branding.logoUrl);
      }
      if (branding.faviconUrl) {
        setFaviconPreview(branding.faviconUrl);
      }
    }
  }, [branding, reset]);

  const onSubmit = async (data: BrandingFormData) => {
    try {
      if (tenantType === 'company' && companyId) {
        // For company tenants, use the actual company ID
        try {
          await updateBranding({
            companyId,
            updateData: {
              ...data,
              logoUrl: data.logoUrl || undefined,
              faviconUrl: data.faviconUrl || undefined,
            },
          });
        } catch {
          // If update fails, try to create new branding
          await createBranding({
            companyId,
            ...data,
            logoUrl: data.logoUrl || undefined,
            faviconUrl: data.faviconUrl || undefined,
          });
        }
      } else if (userData?.id) {
        // For base domain users, use user ID as fallback
        await createBranding({
          companyId: userData.id,
          ...data,
          logoUrl: data.logoUrl || undefined,
          faviconUrl: data.faviconUrl || undefined,
        });
      } else {
        throw new Error('No company or user context available');
      }
      toast.success('Branding updated successfully!');
    } catch (error) {
      toast.error('Failed to update branding. Please try again.');
      console.error('Error updating branding:', error);
    }
  };

  const handleReset = () => {
    if (branding) {
      reset({
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        backgroundColor: branding.backgroundColor,
        logoUrl: branding.logoUrl || '',
        logoAltText: branding.logoAltText || '',
        faviconUrl: branding.faviconUrl || '',
        fontFamily: branding.fontFamily,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setValue('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFaviconPreview(result);
        setValue('faviconUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Branding</h1>
        <p className="mt-2 text-gray-600">
          Customize your company's visual identity with colors, logos, and fonts.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="colors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="size-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center gap-2">
              <LucideImage className="size-4" />
              Logo & Images
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <RotateCcw className="size-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>
                  Choose your primary, secondary, and background colors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        {...register('primaryColor')}
                        className="h-10 w-16 rounded border p-1"
                      />
                      <Input
                        {...register('primaryColor')}
                        placeholder="#11121A"
                        className="flex-1"
                      />
                    </div>
                    {errors.primaryColor && (
                      <p className="text-sm text-red-600">{errors.primaryColor.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        {...register('secondaryColor')}
                        className="h-10 w-16 rounded border p-1"
                      />
                      <Input
                        {...register('secondaryColor')}
                        placeholder="#F4F5F7"
                        className="flex-1"
                      />
                    </div>
                    {errors.secondaryColor && (
                      <p className="text-sm text-red-600">{errors.secondaryColor.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        {...register('backgroundColor')}
                        className="h-10 w-16 rounded border p-1"
                      />
                      <Input
                        {...register('backgroundColor')}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                    {errors.backgroundColor && (
                      <p className="text-sm text-red-600">{errors.backgroundColor.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    {...register('fontFamily')}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                  {errors.fontFamily && (
                    <p className="text-sm text-red-600">{errors.fontFamily.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Images</CardTitle>
                <CardDescription>
                  Upload your company logo and favicon.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex size-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                        {logoPreview
                          ? (
                              <Image
                                src={logoPreview}
                                alt="Logo preview"
                                width={96}
                                height={96}
                                className="max-h-full max-w-full object-contain"
                              />
                            )
                          : (
                              <Upload className="size-8 text-gray-400" />
                            )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="mb-2"
                        />
                        <Input
                          {...register('logoUrl')}
                          placeholder="Or enter logo URL"
                          className="mb-2"
                        />
                        <Input
                          {...register('logoAltText')}
                          placeholder="Logo alt text (for accessibility)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                        {faviconPreview
                          ? (
                              <Image
                                src={faviconPreview}
                                alt="Favicon preview"
                                width={64}
                                height={64}
                                className="max-h-full max-w-full object-contain"
                              />
                            )
                          : (
                              <Upload className="size-6 text-gray-400" />
                            )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="favicon"
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconChange}
                          className="mb-2"
                        />
                        <Input
                          {...register('faviconUrl')}
                          placeholder="Or enter favicon URL"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    See how your branding will look across the application.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="rounded-lg border p-6"
                    style={{
                      backgroundColor: watchedValues.backgroundColor,
                      color: watchedValues.primaryColor,
                      fontFamily: watchedValues.fontFamily,
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        {logoPreview && (
                          <Image
                            src={logoPreview}
                            alt={watchedValues.logoAltText || 'Company Logo'}
                            width={48}
                            height={48}
                            className="h-12 w-auto"
                          />
                        )}
                        <h2 className="text-2xl font-bold">Your Company Name</h2>
                      </div>

                      <div
                        className="rounded p-4"
                        style={{ backgroundColor: watchedValues.secondaryColor }}
                      >
                        <h3 className="mb-2 text-lg font-semibold">Sample Content</h3>
                        <p className="text-sm">
                          This is how your content will look with the selected colors and font.
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          style={{
                            backgroundColor: watchedValues.primaryColor,
                            color: watchedValues.backgroundColor,
                          }}
                        >
                          Primary Button
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          style={{
                            borderColor: watchedValues.primaryColor,
                            color: watchedValues.primaryColor,
                          }}
                        >
                          Secondary Button
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <BrandingTest />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isUpdating}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating
              ? (
                  <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
                )
              : (
                  <Save className="size-4" />
                )}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandingManagement;
