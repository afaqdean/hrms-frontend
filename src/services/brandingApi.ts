import type { BrandingResponse, CreateCompanyBrandingDto, UpdateCompanyBrandingDto } from '../interfaces/CompanyBranding';
import { API } from '../Interceptors/Interceptor';

export const brandingApi = {
  // Get branding by company ID
  getBrandingByCompanyId: async (companyId: string): Promise<BrandingResponse> => {
    const response = await API.get(`/company-branding/company/${companyId}`);
    return response.data;
  },

  // Get branding by subdomain
  getBrandingBySubdomain: async (subdomain: string): Promise<BrandingResponse> => {
    const response = await API.get(`/company-branding/subdomain/${subdomain}`);
    return response.data;
  },

  // Create branding
  createBranding: async (createBrandingDto: CreateCompanyBrandingDto): Promise<BrandingResponse> => {
    const response = await API.post('/company-branding', createBrandingDto);
    return response.data;
  },

  // Update branding
  updateBranding: async (companyId: string, updateBrandingDto: UpdateCompanyBrandingDto): Promise<BrandingResponse> => {
    const response = await API.put(`/company-branding/company/${companyId}`, updateBrandingDto);
    return response.data;
  },

  // Delete branding
  deleteBranding: async (companyId: string): Promise<{ message: string }> => {
    const response = await API.delete(`/company-branding/company/${companyId}`);
    return response.data;
  },

  // Get default branding
  getDefaultBranding: async (): Promise<BrandingResponse> => {
    const response = await API.get('/company-branding/default');
    return response.data;
  },
};
