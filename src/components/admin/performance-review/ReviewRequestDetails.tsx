'use client';

import type { ReviewRequest } from '@/interfaces/PerformanceReview';
import React from 'react';

type ReviewRequestDetailsProps = {
  reviewRequest: ReviewRequest;
};

const ReviewRequestDetails: React.FC<ReviewRequestDetailsProps> = ({ reviewRequest }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-gray-700">Title</div>
          <p className="text-sm text-gray-900">{reviewRequest.title}</p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Status</div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            reviewRequest.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : reviewRequest.status === 'IN_PROGRESS'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}
          >
            {reviewRequest.status}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Due Date</div>
          <p className="text-sm text-gray-900">
            {new Date(reviewRequest.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Created</div>
          <p className="text-sm text-gray-900">
            {new Date(reviewRequest.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700">Reviewee</div>
        <p className="text-sm text-gray-900">
          {reviewRequest.revieweeId.name}
          {' '}
          (
          {reviewRequest.revieweeId.employeeID}
          )
        </p>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700">Initiated By</div>
        <p className="text-sm text-gray-900">{reviewRequest.initiatedBy.name}</p>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700">Assigned Reviewers</div>
        <div className="mt-1 space-y-1">
          {reviewRequest.assignedReviewers.map(reviewer => (
            <div key={reviewer._id} className="text-sm text-gray-900">
              {reviewer.name}
              {' '}
              (
              {reviewer.employeeID}
              )
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700">KPI Questions</div>
        <p className="text-sm text-gray-900">
          {reviewRequest.kpiQuestions.length}
          question(s) assigned
        </p>
      </div>
    </div>
  );
};

export default ReviewRequestDetails;
