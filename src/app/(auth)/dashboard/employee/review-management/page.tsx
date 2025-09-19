'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from '@/components/ui/LoadingState';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeAssignedReviews } from '@/hooks/usePerformanceReview';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { IoChevronBack, IoChevronForward, IoDocumentTextOutline } from 'react-icons/io5';

export default function ReviewManagementPage() {
  const { userData } = useAuth();
  const { data: reviewRequests = [], isLoading, error } = useEmployeeAssignedReviews(userData?.id || '');
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleStartReview = (reviewRequestId: string) => {
    router.push(`/dashboard/employee/review-management/${reviewRequestId}`);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="loading"
          message="Loading review requests..."
          showSpinner
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="error"
          message="Error loading review requests"
          contextText={error?.message || 'Unknown error occurred'}
          actionText="Retry"
          onAction={() => window.location.reload()}
          showSpinner={false}
        />
      </div>
    );
  }

  const pendingRequests = reviewRequests.filter(request => request.status === 'PENDING');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-primary-100">Review Management</h1>
        <p className="text-sm text-gray-600">Manage your performance review requests</p>
      </div>

      {pendingRequests.length === 0
        ? (
            <Card className="py-12 text-center">
              <CardContent>
                <IoDocumentTextOutline className="mx-auto mb-4 size-16 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">No Pending Reviews</h3>
                <p className="text-sm text-gray-600">You don't have any pending performance review requests at the moment.</p>
              </CardContent>
            </Card>
          )
        : (
            <div className="relative">
              {/* Navigation Arrows */}
              {pendingRequests.length > 3 && (
                <>
                  <button
                    type="button"
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 z-10 flex size-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50"
                    aria-label="Scroll left"
                  >
                    <IoChevronBack className="size-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 z-10 flex size-10 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50"
                    aria-label="Scroll right"
                  >
                    <IoChevronForward className="size-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-2 pb-4 md:gap-6"
              >
                {pendingRequests.map(request => (
                  <Card key={request._id} className="min-w-[280px] shrink-0 transition-shadow hover:shadow-lg md:min-w-[320px]">
                    <CardHeader>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription>
                        Due:
                        {' '}
                        {format(new Date(request.dueDate), 'MMM dd, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Initiated by:</p>
                          <p className="text-sm font-semibold text-gray-900">{request.initiatedBy.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status:</p>
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <Button
                          onClick={() => handleStartReview(request._id)}
                          className="w-full"
                        >
                          Start Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Scroll Indicators */}
              {pendingRequests.length > 3 && (
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="size-2 rounded-full bg-gray-300"></div>
                  <div className="size-2 rounded-full bg-gray-300"></div>
                  <div className="size-2 rounded-full bg-gray-300"></div>
                </div>
              )}
            </div>
          )}
    </div>
  );
}
