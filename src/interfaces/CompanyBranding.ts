export type CompanyBranding = {
  id: string;
  companyId: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  logoUrl?: string;
  logoAltText?: string;
  faviconUrl?: string;
  fontFamily: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateCompanyBrandingDto = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
  logoAltText?: string;
  faviconUrl?: string;
  fontFamily?: string;
  isActive?: boolean;
};

export type CreateCompanyBrandingDto = {
  companyId: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
  logoAltText?: string;
  faviconUrl?: string;
  fontFamily?: string;
  isActive?: boolean;
};

export type BrandingResponse = {
  message: string;
  branding: CompanyBranding;
};
