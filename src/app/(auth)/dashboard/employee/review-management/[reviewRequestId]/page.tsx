'use client';

import type { ReviewAnswer } from '@/interfaces/PerformanceReview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from '@/components/ui/LoadingState';

import { Textarea } from '@/components/ui/textarea';
import { useCreateReview, useKPIQuestionsByIds, useReviewRequest } from '@/hooks/usePerformanceReview';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowBack, IoCheckmarkCircle, IoTime } from 'react-icons/io5';

export default function ReviewPage() {
  const params = useParams();
  const reviewRequestId = params.reviewRequestId as string;
  const router = useRouter();
  const { data: reviewRequest, isLoading, error } = useReviewRequest(reviewRequestId);
  const { mutate: submitReview, isPending: isSubmitting } = useCreateReview();
  const [answers, setAnswers] = useState<ReviewAnswer[]>([]);
  const { data: questions = [], isLoading: questionsLoading } = useKPIQuestionsByIds(
    reviewRequest?.kpiQuestions || [],
  );

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, answer };
        return newAnswers;
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const handleSubmit = () => {
    if (!reviewRequest || answers.length === 0) {
      return;
    }

    submitReview({
      reviewRequestId: reviewRequest._id,
      answers,
      comments: '',
    }, {
      onSuccess: () => {
        // Redirect back to review management page
        router.push('/dashboard/employee/review-management');
      },
      onError: (error) => {
        console.error('Error submitting review:', error);
      },
    });
  };

  const isFormValid = answers.length > 0 && answers.every(a => a.answer.trim() !== '');

  if (isLoading || questionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingState
          type="loading"
          message="Loading review..."
          showSpinner
        />
      </div>
    );
  }

  if (error || !reviewRequest) {
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
          Back to Review Management
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-primary-100">{reviewRequest.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <IoTime className="size-4" />
                <span>
                  Due:
                  {format(new Date(reviewRequest.dueDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IoCheckmarkCircle className="size-4" />
                <span>
                  Status:
                  {reviewRequest.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="space-y-6">
        {questions.map((question) => {
          return (
            <Card key={question._id}>
              <CardHeader>
                <CardTitle className="text-lg">{question.question}</CardTitle>
                <CardDescription>
                  Category:
                  {question.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.questionType === 'rating' && (
                  <div>
                    <div className="mb-2 block text-sm font-medium text-gray-700">
                      Rating (1-5):
                    </div>
                    <div className="flex gap-2" role="group" aria-label="Rating selection">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Button
                          key={rating}
                          type="button"
                          variant={answers.find(a => a.questionId === question._id)?.answer === rating.toString() ? 'default' : 'outline'}
                          onClick={() => handleAnswerChange(question._id, rating.toString())}
                          className="size-12"
                          aria-pressed={answers.find(a => a.questionId === question._id)?.answer === rating.toString()}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {question.questionType === 'yes_no' && (
                  <div>
                    <div className="mb-2 block text-sm font-medium text-gray-700">
                      Answer:
                    </div>
                    <div className="flex gap-2" role="group" aria-label="Yes/No selection">
                      <Button
                        type="button"
                        variant={answers.find(a => a.questionId === question._id)?.answer === 'Yes' ? 'default' : 'outline'}
                        onClick={() => handleAnswerChange(question._id, 'Yes')}
                        aria-pressed={answers.find(a => a.questionId === question._id)?.answer === 'Yes'}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={answers.find(a => a.questionId === question._id)?.answer === 'No' ? 'default' : 'outline'}
                        onClick={() => handleAnswerChange(question._id, 'No')}
                        aria-pressed={answers.find(a => a.questionId === question._id)?.answer === 'No'}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}

                {question.questionType === 'text' && (
                  <div>
                    <label htmlFor={`question-${question._id}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Answer:
                    </label>
                    <Textarea
                      id={`question-${question._id}`}
                      placeholder="Enter your answer..."
                      value={answers.find(a => a.questionId === question._id)?.answer || ''}
                      onChange={e => handleAnswerChange(question._id, e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
