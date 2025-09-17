'use client';

import type { Announcement } from '@/interfaces/Annnouncement';
import type { Attendance } from '@/interfaces/Attendance';
import type { Employee } from '@/interfaces/Employee';
import EmployeeOverviewCardsContainer from '@/components/employee/cards/EmployeeOverviewCardsContainer';
import RecentLeavesOverview from '@/components/employee/cards/RecentLeavesOverview';
import CreateLeaveRequest from '@/components/employee/pop-ups/CreateLeaveRequest';
import ModalUI from '@/components/Modal';
import LastUpdatePill from '@/components/shared/pills/LastUpdatePill';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import useAnnouncementsForEmployee from '@/hooks/useAnnouncementsForEmployee';
import { useFetchAttendance } from '@/hooks/useFetchAttendance';
import { useFetchUserProfile } from '@/hooks/useFetchUserProfile';
import { getAttendanceStatusInfo } from '@/utils/attendanceUtils';
import { getHoursColorClass } from '@/utils/getTimeTrackingStatus';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BsClock,
  BsMegaphone,
  BsPeople,
} from 'react-icons/bs';
import { CiWarning } from 'react-icons/ci';
import { IoCheckmarkSharp } from 'react-icons/io5';

// =========================
// Motion Variants
// =========================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // Stagger children for a cascading effect.
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// =========================
// Types for Data Structures
// =========================

type Meeting = {
  id: number;
  title: string;
  time: string;
  attendees: string[];
  type: 'team' | 'client' | 'personal';
};

const sampleMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Weekly Team Sync',
    time: '10:00 AM',
    attendees: ['Team A', 'Team B'],
    type: 'team',
  },
  {
    id: 2,
    title: 'Client Project Review',
    time: '2:30 PM',
    attendees: ['Client X', 'Project Manager'],
    type: 'client',
  },
  {
    id: 3,
    title: '1:1 with Manager',
    time: '4:00 PM',
    attendees: ['Manager'],
    type: 'personal',
  },
];

// =========================
// Helper Hook: useHasAnimated
// =========================
//
// This hook uses sessionStorage to persist a flag indicating whether an animation
// for a given key has already run during this session.
// (If you prefer per-mount behavior instead, simply use a local state variable.)
//
// Example usage: const hasAnimatedTime = useHasAnimated('hasAnimated_time');

function useHasAnimated(storageKey: string): boolean {
  const [hasAnimated, setHasAnimated] = useState<boolean>(() => {
    // When running on the client, check sessionStorage.
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(storageKey) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (!hasAnimated) {
      sessionStorage.setItem(storageKey, 'true');
      setHasAnimated(true);
    }
  }, [hasAnimated, storageKey]);

  return hasAnimated;
}

// =========================
// Components
// =========================

// Status Badge Component
const StatusBadge: React.FC<{ totalHours: string }> = ({ totalHours }) => {
  const { bgColor, textColor, iconType, displayText } = getAttendanceStatusInfo(totalHours);

  // Render the appropriate icon based on the iconType
  const icon = iconType === 'check'
    ? <IoCheckmarkSharp className="mr-1" />
    : <CiWarning className="mr-1" />;

  return (
    <div className={`flex h-8 w-24 items-center justify-center rounded-full md:w-auto xxl:w-24 ${bgColor}`}>
      <div className={`flex items-center p-2 text-center text-sm font-medium md:text-xs xl:text-sm ${textColor}`}>
        {icon}
        {' '}
        {displayText}
      </div>
    </div>
  );
};

// Meeting Card Component
const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
  const typeColors: Record<Meeting['type'], string> = {
    team: 'bg-blue-50 border-blue-200',
    client: 'bg-purple-50 border-purple-200',
    personal: 'bg-green-50 border-green-200',
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`mb-3 rounded-lg border p-3 ${typeColors[meeting.type]} transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BsClock className="text-gray-600" />
          <span className="font-medium text-gray-900">{meeting.time}</span>
        </div>
        <div className="flex items-center space-x-1">
          <BsPeople className="text-gray-600" />
          <span className="text-sm text-gray-600">
            {meeting.attendees.length}
          </span>
        </div>
      </div>
      <h3 className="mt-2 font-medium text-gray-900">{meeting.title}</h3>
      <div className="mt-2 flex flex-wrap gap-1">
        {meeting.attendees.map(attendee => (
          <span
            key={attendee}
            className="rounded-full bg-white px-2 py-1 text-xs text-gray-600"
          >
            {attendee}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Time Tracking Section Component
const TimeTrackingSection: React.FC = () => {
  const hasAnimatedTime = useHasAnimated('hasAnimated_time');
  const [user, setUser] = useState<Employee | null>(null);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Always prioritize localStorage for user data since it contains the complete information
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));

          return;
        }

        // Fallback to userData from context if localStorage is not available
        if (userData) {
          setUser(userData as unknown as Employee);
        }
      } catch (err) {
        console.error(`Error parsing user data: ${err}`);
      }
    };

    fetchUserData();
  }, [userData]);

  const { data: timeData, loading: attendanceLoading } = useFetchAttendance({
    id: user?.machineID,
  });

  // Ensure timeData is sorted by latest date first
  const sortedTimeData = timeData
    ?.filter((item: Attendance) => item.day !== 'Sunday' && item.day !== 'Saturday') // Exclude weekends
    .sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by latest date first
    .slice(0, 5); // Pick the most recent 5 entries after filtering

  const isMeetingsLoading = false; // Replace this with the actual loading state when fetching meetings

  return (
    <div className="mt-24  md:mt-0 md:h-[63vh]  xxl:h-[72vh]">
      <div>
        <div>
          <p className="mt-2 text-left text-lg font-semibold md:text-2xl">Time Tracking</p>
          <p className="mb-4 mt-1 text-left text-sm font-light md:text-base">
            Overview 👋
          </p>
        </div>
        <LastUpdatePill />
      </div>

      <motion.div
        className="md:scrollbar flex h-full flex-col overflow-y-auto rounded-xl bg-white  px-4 pb-0 pt-4 md:p-2 xl:p-4"
        initial={hasAnimatedTime ? undefined : 'hidden'}
        animate="show"
        variants={containerVariants}
      >
        {/* Time Tracking Section */}
        <div className="mb-3">
          {attendanceLoading
            ? (
                <p className="text-center text-gray-500">Loading attendance...</p>
              )
            : sortedTimeData?.length
              ? (
                  sortedTimeData.map((item: Attendance, index: number) => {
                    const displayNumber = index + 1;
                    return (
                      <motion.div
                        key={`attendance-${item.date}`}
                        className="mb-4 flex w-full items-center"
                        variants={itemVariants}
                      >
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${getHoursColorClass(item.totalHours || '')}`}
                        >
                          <p className="text-sm font-medium">{displayNumber}</p>
                        </div>
                        <div className="ml-3 grow">
                          <p className="text-sm font-medium text-gray-900">
                            {item.day}
                          </p>
                          <p className="text-xs text-gray-500 md:hidden xl:block">
                            {new Date(item.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>

                          <p className="hidden text-xs text-gray-500 md:block xl:hidden">
                            {new Date(item.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <StatusBadge totalHours={item?.totalHours} />
                      </motion.div>
                    );
                  })
                )
              : (
                  <p className="text-center text-gray-500">No time tracking to show</p>
                )}
        </div>

        {/* Meetings Section */}
        <div className="border-t pt-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Meetings</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 md:text-xs xl:text-sm">
              {sampleMeetings.length}
              {' '}
              Scheduled
            </span>
          </div>

          <div className="md:scrollbar overflow-y-auto">
            {isMeetingsLoading
              ? (
                  <p className="text-center text-gray-500">Loading meetings...</p>
                )
              : sampleMeetings.length
                ? (
                    sampleMeetings.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))
                  )
                : (
                    <p className="text-center text-gray-500">No meetings to show</p>
                  )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Announcement Section Component
const AnnouncementSection: React.FC = () => {
  const hasAnimatedAnnouncement = useHasAnimated('hasAnimated_announcement');
  const [applyLeaveModal, setApplyLeaveModal] = useState(false);
  const { Announcements: announcements, isLoading: announcementsLoading } = useAnnouncementsForEmployee();
  // First, create a priority order helper function
  const getPriorityOrder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 1;
      case 'medium':
        return 2;
      case 'low':
        return 3;
      default:
        return 4;
    }
  };

  return (
    <div className="mb-4 mt-20 w-full md:my-0 md:h-[63vh] xxl:h-[72vh]">
      <p className="mt-2 text-left text-lg font-semibold md:text-2xl">Announcements</p>
      <p className="mb-4 mt-1 text-left text-sm font-light md:text-base">
        Stay Updated
      </p>
      <div className="flex h-full flex-col rounded-xl bg-white p-4 md:p-2 xl:p-4">
        <div className="scrollbar h-full overflow-y-auto">
          {announcementsLoading
            ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-gray-500">Loading Details...</p>
                </div>
              )
            : announcements?.length
              ? (
                  <motion.div
                    initial={hasAnimatedAnnouncement ? undefined : 'hidden'}
                    animate="show"
                    variants={containerVariants}
                  >
                    {announcements
                      .slice(0, 5)
                      .sort((a: any, b: any) => {
                      // First sort by priority
                        const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
                        if (priorityDiff !== 0) {
                          return priorityDiff;
                        }

                        // If priorities are equal, sort by date (newest first)
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                      })
                      .map((item: Announcement) => (
                        <motion.div
                          key={item._id}
                          className="group mb-1 flex w-full  flex-col gap-2 rounded-lg border-b border-gray-300 p-1 px-0 transition-all hover:bg-gray-50"
                          variants={itemVariants}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex size-6 items-center justify-center rounded-full bg-green-100">
                                <BsMegaphone size={12} className="text-green-600" />
                              </div>
                              {item.priority === 'high'
                                ? (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                      Important
                                    </span>
                                  )
                                : item.priority === 'medium'
                                  ? (
                                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-600">
                                        Medium
                                      </span>
                                    )
                                  : (
                                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                                        Low
                                      </span>
                                    )}
                            </div>
                            {/* TODO: Add a read more button */}
                            {/* <Button variant="ghost" size="sm" className="text-primary">
                            Read More
                          </Button> */}
                          </div>
                          <div className="ml-3 grow">
                            <div className="flex items-center gap-2 pr-3">
                              <p className="break-all text-sm font-medium text-gray-900">{item.title}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                )
              : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-gray-500">No announcements to show</p>
                  </div>
                )}
          <hr className="mt-6 h-px w-full rounded-full bg-gradient-to-r from-transparent via-secondary-200 to-transparent opacity-70" />

          <div className="my-4">
            <div>
              <h2 className="my-2 text-lg font-semibold text-gray-900">Recent Leaves</h2>

            </div>
            <RecentLeavesOverview />
          </div>
        </div>

        {/* Apply Leave Button */}
        <div className="mt-auto border-t pt-2">
          <Button className="w-full" onClick={() => setApplyLeaveModal(true)}>
            Apply for Leave
          </Button>
        </div>

        {/* Apply Leave Modal */}
        {applyLeaveModal && (
          <ModalUI
            handleClose={() => setApplyLeaveModal(false)}
            handleOpen={() => setApplyLeaveModal(true)}
            isOpen={applyLeaveModal}
          >
            <CreateLeaveRequest onClose={() => setApplyLeaveModal(false)} />
          </ModalUI>
        )}
      </div>
    </div>
  );
};

// Main Container Component
const EmployeeOverviewContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();
  const { data: fetchedUser, isLoading: userLoading, isError } = useFetchUserProfile();

  useEffect(() => {
    if (fetchedUser) {
      localStorage.setItem('user', JSON.stringify(fetchedUser));
      setIsLoading(false);
    } else if (isError) {
      // API call failed, try localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setIsLoading(false);
        return;
      }

      // Final fallback: use context or prop
      if (userData) {
        setIsLoading(false);
      }
    } else if (!userLoading && !fetchedUser) {
      // No data, no error (empty response?)
      setIsLoading(false);
    }
  }, [fetchedUser, isError, userLoading, userData]);

  // Function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }
    if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }
    if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    }
    return 'Good Night';
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <p className="text-center text-lg font-medium text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="size-full px-2 pt-2  xxl:mx-auto">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-1 xl:gap-6 ">
        <div className="mt-2 md:mt-0">
          <p className="text-left text-2xl font-semibold">{getGreeting()}</p>
          <p className="mb-6 mt-1 text-left text-lg font-light">
            Hello
            {' '}
            {userData?.name}
            {' '}
            👋
          </p>
          <EmployeeOverviewCardsContainer />
        </div>

        <div className="space-y-6">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <TimeTrackingSection />
            <AnnouncementSection />
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeOverviewContainer;
