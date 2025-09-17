/* eslint-disable react/no-array-index-key */
import { useDashboardStats } from '@/hooks/useAdminDashboardStats';
import { AlertCircle, Clock, UserCheck, Users, UserX } from 'lucide-react';
// AdminOverviewCardComponentsContainer.tsx
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import AdminOverviewCardComponent from './card/AdminOverviewCard';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminOverviewCardComponentsContainer = () => {
  // const { Employees: employees = [], isLoading: employeesLoading } = useEmployees();
  // const { data: attendance = [], loading: attendanceLoading } = useFetchAttendance({});
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

  const [stats, setStats] = useState({
    totalEmployees: '0',
    presentEmployees: '0',
    absentEmployees: '0',
    // activeLeaves: '0',
    pendingLeaves: '0',
    upcomingLeaves: '0',
  });

  useEffect(() => {
    if (dashboardStats) {
      const totalEmployees = dashboardStats?.totalEmployees?.count || 0;
      const presentEmployees = dashboardStats?.presentToday || 0;
      const absentEmployees = totalEmployees - presentEmployees;

      setStats({
        totalEmployees: totalEmployees.toString(),
        presentEmployees: `${presentEmployees}/${totalEmployees}`,
        absentEmployees: `${absentEmployees}/${totalEmployees}`,
        // activeLeaves: dashboardStats?.activeLeaves || '0',
        pendingLeaves: dashboardStats?.pendingLeaves || '0',
        upcomingLeaves: dashboardStats?.upcomingLeaves || '0',
      });
    }
  }, [dashboardStats]);

  if (!dashboardStats || statsLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-sm bg-white p-2 md:grid-cols-5 md:p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="rounded-lg border border-secondary-100 bg-white p-4 shadow-sm">
            <Skeleton height={20} width="50%" className="mb-2" />
            <Skeleton height={30} width="30%" className="mb-1" />
            <Skeleton height={16} width="60%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 rounded-sm bg-white p-2 md:grid-cols-5 md:p-4 ">
      <AdminOverviewCardComponent
        text="Total Employees"
        number={stats.totalEmployees}
        trend={`${dashboardStats?.totalEmployees?.percentageChange} %`}
        icon={<Users className="size-6" />}
        className="bg-gradient-to-br from-blue-100 to-blue-50 hover:shadow-lg"
        iconBg="bg-blue-500/10"
        iconColor="text-blue-600"
        description="Total workforce"
      />
      <AdminOverviewCardComponent
        text="Present"
        number={stats.presentEmployees}
        percentage={
          stats.presentEmployees && stats.presentEmployees.includes('/')
            ? (() => {
                const parts = stats.presentEmployees.split('/');
                const numerator = Number.parseInt(parts[0] || '0', 10);
                const denominator = Number.parseInt(parts[1] || '1', 10);
                const percentage = Math.round((numerator / denominator) * 100);
                return `${Number.isNaN(percentage) ? 0 : percentage}%`;
              })()
            : '0%'
        }
        icon={<UserCheck className="size-6" />}
        className="bg-gradient-to-br from-green-100 to-green-50 hover:shadow-lg"
        iconBg="bg-green-500/10"
        iconColor="text-green-600"
        description="Currently at work"
      />
      <AdminOverviewCardComponent
        text="Absents"
        number={stats.absentEmployees}
        percentage={
          stats.absentEmployees && stats.absentEmployees.includes('/')
            ? (() => {
                const parts = stats.absentEmployees.split('/');
                const numerator = Number.parseInt(parts[0] || '0', 10);
                const denominator = Number.parseInt(parts[1] || '1', 10);
                const percentage = Math.round((numerator / denominator) * 100);
                return `${Number.isNaN(percentage) ? 0 : percentage}%`;
              })()
            : '0%'
        }
        icon={<UserX className="size-6" />}
        className="bg-gradient-to-br from-red-100 to-red-50 hover:shadow-lg"
        iconBg="bg-red-500/10"
        iconColor="text-red-600"
        description="Not present today"
      />
      {/* <AdminOverviewCardComponent
        text="Active Leaves"
        number={stats.activeLeaves}
        icon={<Calendar className="size-6" />}
        className="bg-gradient-to-br from-blue-100 to-blue-50 hover:shadow-lg"
        iconBg="bg-blue-500/10"
        iconColor="text-blue-600"
        description="Currently on leave"
      /> */}
      <AdminOverviewCardComponent
        text="Pending Leave Requests"
        number={stats.pendingLeaves}
        icon={<Clock className="size-6" />}
        className="bg-gradient-to-br from-yellow-100 to-yellow-50 hover:shadow-lg"
        iconBg="bg-yellow-500/10"
        iconColor="text-yellow-600"
        description="Awaiting approval"
      />
      <AdminOverviewCardComponent
        text="Upcoming Leaves"
        number={stats.upcomingLeaves}
        icon={<AlertCircle className="size-6" />}
        className="bg-gradient-to-br from-purple-100 to-purple-50 hover:shadow-lg"
        iconBg="bg-purple-500/10"
        iconColor="text-purple-600"
        description="Next 30 days"
        showUpcomingLeavesDetails
      />
    </div>
  );
};

export default AdminOverviewCardComponentsContainer;
