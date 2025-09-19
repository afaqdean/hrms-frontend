'use client';

import Loader from '@/components/ui/Loader';

export default function DashboardLoading() {
  return (
    <div className="flex size-full items-center justify-center">
      <Loader
        size="lg"
        color="#000000"
        withText
        text="Loading your dashboard..."
      />
    </div>
  );
}
