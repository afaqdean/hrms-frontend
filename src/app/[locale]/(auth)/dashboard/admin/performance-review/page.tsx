import { redirect } from 'next/navigation';

export default function PerformanceReviewPage() {
  // Redirect to the main dashboard or show a list of employees
  // For now, redirect to the main admin dashboard
  redirect('/dashboard/admin');
}
