'use client';

import PerformanceReviewContainer from '@/containers/admin/performance-review/PerformanceReviewContainer';
import { useParams } from 'next/navigation';
import React from 'react';

export default function PerformanceReviewPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;

  return (
    <PerformanceReviewContainer
      employeeId={employeeId}
      onCloseAction={() => window.history.back()}
    />
  );
}
