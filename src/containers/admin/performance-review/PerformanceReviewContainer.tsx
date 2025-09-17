'use client';

import type { Employee } from '@/interfaces/Employee';
import CreateReviewRequest from '@/components/admin/performance-review/CreateReviewRequest';
import ReviewRequestsList from '@/components/admin/performance-review/ReviewRequestsList';
import BackArrow from '@/components/ui/back-arrow';
import { Button } from '@/components/ui/button';
import LoadingState from '@/components/ui/LoadingState';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type PerformanceReviewContainerProps = {
  employeeId: string;
  employeeName?: string;
  onCloseAction?: () => void;
};

export default function PerformanceReviewContainer({
  employeeId,
  employeeName: _initialEmployeeName,
  onCloseAction,
}: PerformanceReviewContainerProps) {
  const [currentView, setCurrentView] = useState<'create' | 'list'>('create');
  const router = useRouter();

  // React Query for fetching employee data
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async (): Promise<Employee> => {
      const response = await API.get(`/admin/employee/${employeeId}`);
      return response.data;
    },
    enabled: !!employeeId,
  });

  const handleViewAllRequests = () => {
    setCurrentView('list');
  };

  const handleBackToCreate = () => {
    setCurrentView('create');
  };

  const handleBack = () => {
    if (onCloseAction) {
      onCloseAction();
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState
          type="loading"
          message="Loading employee information..."
          showSpinner
        />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingState
          type="error"
          message="Employee not found"
          actionText="Go Back"
          onAction={handleBack}
          showSpinner={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackArrow onClick={handleBack} />
            <div>
              <h1 className="text-2xl font-bold text-primary-100">
                Performance Review
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Employee:
                {' '}
                <span className="text-base font-semibold text-gray-900">{employee.name}</span>
                {' '}
                •
                <span className="text-sm text-gray-600">{employee.position}</span>
              </p>
            </div>
          </div>

          {/* View All Requests Button - Top Right */}
          {currentView === 'create' && (
            <Button
              onClick={handleViewAllRequests}
              size="sm"
              className="flex items-center gap-2 bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
            >
              <Eye className="mr-2 size-4" />
              View All Requests
            </Button>
          )}

          {/* Back to Create Button - Top Right */}
          {currentView === 'list' && (
            <Button
              onClick={handleBackToCreate}
              size="sm"
              className="flex items-center gap-2 bg-green-600 text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
            >
              Create New Review
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentView === 'create'
          ? (
              <CreateReviewRequest
                employeeId={employeeId}
                employeeName={employee.name}
                onCloseAction={handleBack}
              />
            )
          : (
              <ReviewRequestsList
                employeeId={employeeId}
                employeeName={employee.name}
                onBack={handleBackToCreate}
              />
            )}
      </div>
    </div>
  );
}
