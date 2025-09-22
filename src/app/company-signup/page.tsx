'use client';

import type { CompanySignupForm } from '@/interfaces';
import FormField from '@/components/shared/forms/FormField';
import FormSectionCard from '@/components/shared/forms/FormSectionCard';
import SubdomainInput from '@/components/shared/forms/SubdomainInput';
import ErrorAlert from '@/components/ui/alerts/ErrorAlert';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/context/useTenant';
import { useCompanyRegistration } from '@/hooks/useCompanyRegistration';
import { useSubdomainAvailability } from '@/hooks/useSubdomainAvailability';
import React, { useState } from 'react';

export default function CompanySignupPage() {
  const { tenantType } = useTenant();
  const [formData, setFormData] = useState<CompanySignupForm>({
    companyName: '',
    subdomain: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminEmployeeID: '',
    adminCNIC: '',
    adminPosition: '',
    adminJoiningDate: '',
    adminMachineID: '',
  });
  const [error, setError] = useState('');

  // Use the new hooks
  const { isAvailable: subdomainAvailable, isLoading: isCheckingSubdomain, error: subdomainError } = useSubdomainAvailability(formData.subdomain);
  const { registerCompany, isLoading: isRegistering, error: registrationError } = useCompanyRegistration();

  // Only allow signup on base domain
  if (tenantType === 'company') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Company Signup Not Available
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Company signup is only available on the main domain.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate subdomain from company name
    if (name === 'companyName') {
      const subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        subdomain,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if subdomain is available before submitting
    if (formData.subdomain && subdomainAvailable === false) {
      setError('Subdomain is not available. Please choose a different one.');
      return;
    }

    registerCompany({
      name: formData.companyName,
      subdomain: formData.subdomain,
      adminUser: {
        name: formData.adminName,
        email: formData.adminEmail,
        password: formData.adminPassword,
        employeeID: formData.adminEmployeeID,
        cnic: formData.adminCNIC,
        position: formData.adminPosition,
        joiningDate: formData.adminJoiningDate,
        machineID: formData.adminMachineID,
        role: 'Admin',
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Company Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get your own HRMS instance at
            {' '}
            <span className="font-semibold">companyname.hr-ify.com</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Company Information */}
            <FormSectionCard title="Company Information">
              <div className="space-y-4">
                <FormField
                  label="Company Name"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />

                <SubdomainInput
                  label="Subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  required
                  isChecking={isCheckingSubdomain}
                  isAvailable={subdomainAvailable}
                  availabilityError={subdomainError}
                />
              </div>
            </FormSectionCard>

            {/* Admin User Information */}
            <FormSectionCard title="Admin User Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Full Name"
                  name="adminName"
                  type="text"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Email"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Password"
                  name="adminPassword"
                  type="password"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Employee ID"
                  name="adminEmployeeID"
                  type="text"
                  value={formData.adminEmployeeID}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="CNIC"
                  name="adminCNIC"
                  type="text"
                  value={formData.adminCNIC}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Position"
                  name="adminPosition"
                  type="text"
                  value={formData.adminPosition}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Joining Date"
                  name="adminJoiningDate"
                  type="date"
                  value={formData.adminJoiningDate}
                  onChange={handleInputChange}
                  required
                />

                <FormField
                  label="Machine ID"
                  name="adminMachineID"
                  type="text"
                  value={formData.adminMachineID}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </FormSectionCard>
          </div>

          {(error || registrationError) && (
            <ErrorAlert
              title="Registration Error"
              message={error || registrationError || 'An error occurred during registration'}
            />
          )}

          <div>
            <Button
              type="submit"
              disabled={isRegistering || subdomainAvailable === false || isCheckingSubdomain}
              className="w-full"
            >
              {isRegistering ? 'Creating Company...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
