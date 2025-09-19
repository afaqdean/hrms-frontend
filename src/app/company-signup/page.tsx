'use client';

import { useTenant } from '@/context/useTenant';
import React, { useState } from 'react';

type CompanySignupForm = {
  companyName: string;
  subdomain: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminEmployeeID: string;
  adminCNIC: string;
  adminPosition: string;
  adminJoiningDate: string;
  adminMachineID: string;
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

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

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain) {
      return;
    }

    try {
      const response = await fetch(`/api/company/subdomain/${subdomain}`);
      const data = await response.json();
      setSubdomainAvailable(data.available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
    }
  };

  const handleSubdomainBlur = () => {
    if (formData.subdomain) {
      checkSubdomainAvailability(formData.subdomain);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register company');
      }

      // Redirect to the new company subdomain
      window.location.href = `https://${formData.subdomain}.hr-ify.com/sign-in`;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Company Information</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                    Subdomain
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      id="subdomain"
                      name="subdomain"
                      type="text"
                      required
                      value={formData.subdomain}
                      onChange={handleInputChange}
                      onBlur={handleSubdomainBlur}
                      className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                    <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      .hr-ify.com
                    </span>
                  </div>
                  {subdomainAvailable !== null && (
                    <p className={`mt-1 text-sm ${subdomainAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {subdomainAvailable ? '✓ Available' : '✗ Not available'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin User Information */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Admin User Information</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="adminName"
                    name="adminName"
                    type="text"
                    required
                    value={formData.adminName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    required
                    value={formData.adminPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminEmployeeID" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    id="adminEmployeeID"
                    name="adminEmployeeID"
                    type="text"
                    required
                    value={formData.adminEmployeeID}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminCNIC" className="block text-sm font-medium text-gray-700">
                    CNIC
                  </label>
                  <input
                    id="adminCNIC"
                    name="adminCNIC"
                    type="text"
                    required
                    value={formData.adminCNIC}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminPosition" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    id="adminPosition"
                    name="adminPosition"
                    type="text"
                    required
                    value={formData.adminPosition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminJoiningDate" className="block text-sm font-medium text-gray-700">
                    Joining Date
                  </label>
                  <input
                    id="adminJoiningDate"
                    name="adminJoiningDate"
                    type="date"
                    required
                    value={formData.adminJoiningDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="adminMachineID" className="block text-sm font-medium text-gray-700">
                    Machine ID
                  </label>
                  <input
                    id="adminMachineID"
                    name="adminMachineID"
                    type="text"
                    required
                    value={formData.adminMachineID}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || subdomainAvailable === false}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating Company...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
