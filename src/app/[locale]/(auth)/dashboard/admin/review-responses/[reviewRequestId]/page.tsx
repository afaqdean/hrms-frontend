'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from '@/components/ui/LoadingState';
import { useReviewRequest, useReviewsByRequestId } from '@/hooks/usePerformanceReview';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBack, IoCheckmarkCircle, IoDocumentTextOutline, IoPerson, IoTime } from 'react-icons/io5';

export default function AdminReviewResponsesPage() {
  const params = useParams();
  const reviewRequestId = params.reviewRequestId as string;
  const router = useRouter();

  const { data: reviewRequest, isLoading: requestLoading, error: requestError } = useReviewRequest(reviewRequestId);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviewsByRequestId(reviewRequestId);

  if (requestLoading || reviewsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="loading"
          message="Loading review responses..."
          showSpinner
        />
      </div>
    );
  }

  if (requestError || !reviewRequest) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="error"
          message="Error loading review request"
          contextText={requestError?.message || 'Review request not found'}
          actionText="Go Back"
          onAction={() => router.back()}
          showSpinner={false}
        />
      </div>
    );
  }

  const submittedReviews = reviews.filter(review => review.status === 'SUBMITTED');
  const pendingReviews = reviews.filter(review => review.status === 'DRAFT');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <IoArrowBack className="mr-2 size-4" />
          Back to Review Requests
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-primary-100">Review Responses</h1>
          <p className="text-sm text-gray-600">View all submitted reviews for this performance review request</p>
        </div>

        {/* Review Request Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{reviewRequest.title}</CardTitle>
            <CardDescription>
              Performance review request details and submission status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <IoPerson className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reviewee</p>
                  <p className="text-sm font-semibold text-gray-900">{reviewRequest.revieweeId.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IoTime className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900">{format(new Date(reviewRequest.dueDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IoCheckmarkCircle className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={reviewRequest.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {reviewRequest.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{submittedReviews.length}</p>
                <p className="text-sm text-gray-600">Submitted Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</p>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{reviewRequest.assignedReviewers.length}</p>
                <p className="text-sm text-gray-600">Total Reviewers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Responses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-100">Review Responses</h2>
          <Badge variant="outline">
            {submittedReviews.length}
            {' '}
            of
            {reviewRequest.assignedReviewers.length}
            {' '}
            completed
          </Badge>
        </div>

        {submittedReviews.length === 0
          ? (
              <Card className="py-12 text-center">
                <CardContent>
                  <IoDocumentTextOutline className="mx-auto mb-4 size-16 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">No Reviews Submitted Yet</h3>
                  <p className="text-sm text-gray-600">Reviewers are still working on their assessments.</p>
                </CardContent>
              </Card>
            )
          : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submittedReviews.map(review => (
                  <Card key={review._id} className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Review by
                          {review.reviewerId.name}
                        </CardTitle>
                        <Badge variant="default" className="text-xs">
                          Submitted
                        </Badge>
                      </div>
                      <CardDescription>
                        Employee ID:
                        {' '}
                        {review.reviewerId.employeeID}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Submitted on:</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {review.submittedAt ? format(new Date(review.submittedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Questions answered:</p>
                          <p className="text-sm font-semibold text-gray-900">{review.answers.length}</p>
                        </div>
                        {review.comments && (
                          <div>
                            <p className="text-sm text-gray-600">General comments:</p>
                            <p className="line-clamp-2 text-sm text-gray-800">{review.comments}</p>
                          </div>
                        )}
                        <Button
                          onClick={() => router.push(`/dashboard/admin/review-responses/${reviewRequestId}/review/${review._id}`)}
                          className="w-full"
                          variant="outline"
                        >
                          View Full Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

        {/* Pending Reviews Section */}
        {pendingReviews.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-xl font-bold text-primary-100">Pending Reviews</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingReviews.map(review => (
                <Card key={review._id} className="border-dashed border-gray-300 bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <IoDocumentTextOutline className="mx-auto mb-2 size-8 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">{review.reviewerId.name}</p>
                      <p className="text-sm text-gray-500">
                        Employee ID:
                        {review.reviewerId.employeeID}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        In Progress
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
