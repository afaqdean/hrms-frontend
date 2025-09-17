'use client';

import BackArrow from '@/components/ui/back-arrow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingState from '@/components/ui/LoadingState';
import { useDeleteReviewRequest, useEmployeeReviewRequests } from '@/hooks/usePerformanceReview';
import { Calendar, Eye, FileText, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type ReviewRequestsListProps = {
  employeeId: string;
  employeeName: string;
  onBack: () => void;
};

const ReviewRequestsList: React.FC<ReviewRequestsListProps> = ({
  employeeId,
  employeeName,
  onBack,
}) => {
  const { data: reviewRequests = [], isLoading } = useEmployeeReviewRequests(employeeId);
  const deleteReviewRequestMutation = useDeleteReviewRequest();
  const router = useRouter();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteReviewRequestMutation.mutateAsync(requestId);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error deleting review request:', error);
    }
  };

  const confirmDelete = (requestId: string) => {
    setDeleteConfirmId(requestId);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <BackArrow onClick={onBack} />
            <div>
              <h1 className="text-2xl font-bold text-primary-100">Review Requests</h1>
              <p className="mt-1 text-sm text-gray-600">
                Employee:
                {' '}
                <span className="text-base font-semibold text-gray-900">{employeeName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {isLoading
            ? (
                <LoadingState
                  type="loading"
                  message="Loading review requests..."
                  showSpinner
                  className="py-12"
                />
              )
            : reviewRequests.length === 0
              ? (
                  <LoadingState
                    type="empty"
                    message="No review requests found for this employee."
                    showSpinner={false}
                    className="py-12"
                  />
                )
              : (
                  <div className="divide-y divide-gray-100">
                    {reviewRequests.map(request => (
                      <div key={request._id} className="p-6 transition-colors duration-200 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                                <FileText className="size-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    <span>
                                      Due:
                                      {new Date(request.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="size-4" />
                                    <span>
                                      {request.assignedReviewers?.length || 0}
                                      {' '}
                                      reviewers
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant={request.status === 'COMPLETED' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {request.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {request.kpiQuestions?.length || 0}
                                {' '}
                                KPI questions
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/dashboard/admin/review-responses/${request._id}`)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye className="mr-1 size-4" />
                              View Response
                            </Button>
                            {deleteConfirmId === request._id
                              ? (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteRequest(request._id)}
                                      disabled={deleteReviewRequestMutation.isPending}
                                      className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                                    >
                                      {deleteReviewRequestMutation.isPending
                                        ? (
                                            <div className="size-4 animate-spin rounded-full border-b-2 border-red-600 border-t-transparent"></div>
                                          )
                                        : (
                                            'Confirm'
                                          )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={cancelDelete}
                                      className="text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )
                              : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => confirmDelete(request._id)}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
        </div>
      </div>
    </div>
  );
};

export default ReviewRequestsList;
