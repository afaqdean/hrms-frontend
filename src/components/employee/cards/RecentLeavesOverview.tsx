'use client';

import type { Leave } from '@/interfaces/Leave';
import useLeavesForEmployee from '@/hooks/useLeavesForEmployee';
import { getLeaveTypeBackground, getLeaveTypeIcon, getStatusColorClasses, getStatusIcon } from '@/hooks/useLeaveStyles';

const RecentLeavesOverview = () => {
  const { Leaves, isLoading } = useLeavesForEmployee();

  // Get 3 most recent leaves
  const recentLeaves = [...(Leaves || [])]
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl bg-white  shadow-md">
        <p className="text-sm text-secondary-400">Loading recent leaves...</p>
      </div>
    );
  }

  if (!recentLeaves.length) {
    return (
      <div className="flex h-full items-center justify-center xxl:h-60">
        <p className="text-sm text-secondary-400">No recent leaves found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white  shadow-md transition-all duration-300 ease-in-out">
      <div className="space-y-4">
        {recentLeaves.map((leave: Leave) => (
          <div
            key={leave._id}
            className="group flex items-center justify-between rounded-lg border border-secondary-100 p-2 transition-all duration-300 ease-in-out hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`flex size-10 items-center justify-center rounded-full ${getLeaveTypeBackground(leave.leaveType)}`}>
                {getLeaveTypeIcon(leave.leaveType)}
              </div>
              <div>
                <h3 className="font-medium text-primary-100">
                  {leave.leaveType}
                  {' Leave'}
                </h3>
                <p className="text-xs text-secondary-400">{leave.date}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${getStatusColorClasses(leave.status)}`}>
              {getStatusIcon(leave.status)}
              <span className="text-xs font-medium">{leave.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentLeavesOverview;
