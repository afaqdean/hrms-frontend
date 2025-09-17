'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from '@/components/ui/LoadingState';
import { useKPIQuestionsByIds, useReview } from '@/hooks/usePerformanceReview';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { IoArrowBack, IoPerson, IoTime } from 'react-icons/io5';

export default function AdminReviewDetailPage() {
  const params = useParams();
  const reviewId = params.reviewId as string;
  const router = useRouter();

  const { data: review, isLoading, error } = useReview(reviewId);
  const { data: questions = [] } = useKPIQuestionsByIds(
    review?.answers.map(a => a.questionId) || [],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="loading"
          message="Loading review details..."
          showSpinner
        />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="error"
          message="Error loading review"
          contextText={error?.message || 'Review not found'}
          actionText="Go Back"
          onAction={() => router.back()}
          showSpinner={false}
        />
      </div>
    );
  }

  const getQuestionText = (questionId: string) => {
    const question = questions.find(q => q._id === questionId);
    return question?.question || 'Question not found';
  };

  const getQuestionType = (questionId: string) => {
    const question = questions.find(q => q._id === questionId);
    return question?.questionType || 'text';
  };

  const getQuestionCategory = (questionId: string) => {
    const question = questions.find(q => q._id === questionId);
    return question?.category || 'General';
  };

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
          Back to Review Responses
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-primary-100">Review Details</h1>
          <p className="text-sm text-gray-600">
            Complete review submission by
            {' '}
            <span className="text-base font-semibold text-gray-900">{review.reviewerId.name}</span>
          </p>
        </div>

        {/* Review Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Review Submission</CardTitle>
              <Badge variant={review.status === 'SUBMITTED' ? 'default' : 'secondary'}>
                {review.status}
              </Badge>
            </div>
            <CardDescription>
              Performance review assessment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <IoPerson className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reviewer</p>
                  <p className="text-sm font-semibold text-gray-900">{review.reviewerId.name}</p>
                  <p className="text-xs text-gray-500">
                    ID:
                    {review.reviewerId.employeeID}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IoPerson className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reviewee</p>
                  <p className="text-sm font-semibold text-gray-900">{review.revieweeId.name}</p>
                  <p className="text-xs text-gray-500">
                    ID:
                    {review.revieweeId.employeeID}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IoTime className="size-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Submitted on</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {review.submittedAt ? format(new Date(review.submittedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Answers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-100">Review Responses</h2>
          <Badge variant="outline">
            {review.answers.length}
            {' '}
            questions answered
          </Badge>
        </div>

        {review.answers.map((answer, index) => {
          const questionText = getQuestionText(answer.questionId);
          const questionType = getQuestionType(answer.questionId);
          const questionCategory = getQuestionCategory(answer.questionId);

          return (
            <Card key={answer.questionId} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-lg">
                      Question
                      {' '}
                      {index + 1}
                    </CardTitle>
                    <p className="mb-2 text-gray-700">{questionText}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {questionCategory}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {questionType === 'rating' ? 'Rating' : questionType === 'yes_no' ? 'Yes/No' : 'Text'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700">Answer:</p>
                    {questionType === 'rating' && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <div
                              key={rating}
                              className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                                Number.parseInt(answer.answer) >= rating
                                  ? 'bg-primary-100 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {rating}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          (
                          {answer.answer}
                          /5)
                        </span>
                      </div>
                    )}
                    {questionType === 'yes_no' && (
                      <Badge variant="default" className="text-sm">
                        {answer.answer}
                      </Badge>
                    )}
                    {questionType === 'text' && (
                      <p className="rounded-md bg-gray-50 p-3 text-gray-800">
                        {answer.answer}
                      </p>
                    )}
                  </div>

                  {answer.additionalComments && (
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-700">Additional Comments:</p>
                      <p className="rounded-md bg-gray-50 p-3 text-gray-800">
                        {answer.additionalComments}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* General Comments */}
        {review.comments && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary-100">General Comments</CardTitle>
              <CardDescription>
                Overall feedback and comments about the review period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-gray-800">{review.comments}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary-100">Review Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Review ID:</p>
                <p className="font-mono text-sm text-gray-800">{review._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created on:</p>
                <p className="text-sm text-gray-800">{format(new Date(review.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last updated:</p>
                <p className="text-sm text-gray-800">{format(new Date(review.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <Badge variant={review.status === 'SUBMITTED' ? 'default' : 'secondary'}>
                  {review.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
