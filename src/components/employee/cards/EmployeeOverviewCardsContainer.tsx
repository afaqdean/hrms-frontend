import { useAuth } from '@/context/AuthContext';
import useLeavesForEmployee from '@/hooks/useLeavesForEmployee';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { CiCalculator1, CiMedicalCross } from 'react-icons/ci';
import { GiSandsOfTime } from 'react-icons/gi';
import Skeleton from 'react-loading-skeleton';
import EmployeeOverviewCard from './card/EmployeeOverviewCard';
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure skeleton animations work

/**
 * EmployeeOverviewCardsContainer renders a grid of EmployeeOverviewCard components
 * with staggered animations using Framer Motion.
 */
const EmployeeOverviewCardsContainer = () => {
  // Using React Query to fetch leave data
  const { userData } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { Leaves: leaveData, isLoading: leavesLoading } = useLeavesForEmployee();

  // Function to update user data from localStorage
  const updateUserDataFromStorage = useCallback(() => {
    const userFromStorage = window.localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        // Only update state if the data has actually changed to prevent infinite loops
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Always prioritize localStorage for user data since it contains the complete leave information
        updateUserDataFromStorage();

        // Fallback to userData from context if localStorage is not available
        if (!window.localStorage.getItem('user') && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userData, updateUserDataFromStorage]);

  // Update user data when leave data changes
  useEffect(() => {
    if (leaveData) {
      updateUserDataFromStorage();
    }
  }, [leaveData, updateUserDataFromStorage]);

  // Add a listener for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        updateUserDataFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateUserDataFromStorage]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: 'beforeChildren', staggerChildren: 0.2 },
    },
  };

  // Individual card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 12, mass: 0.8 } },
  };

  // Skeleton Loader for Cards
  if (isLoading || leavesLoading) {
    return (
      <div className="grid size-full grid-cols-2 gap-2 md:h-[62vh] xxl:h-[72vh]">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`employee-card-${index}`} className="rounded-lg bg-white p-4 shadow-md">
            <Skeleton height={20} width="50%" className="mb-2" />
            <Skeleton height={16} width="80%" className="mb-1" />
            <Skeleton height={16} width="60%" />
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  // Safely calculate values with fallbacks to prevent NaN
  const availedCasualLeaves = user?.availedCasualLeaves || 0;
  const availedAnnualLeaves = user?.availedAnnualLeaves || 0;
  const availedSickLeaves = user?.availedSickLeaves || 0;
  const annualLeaveBank = user?.annualLeaveBank || 0;
  const casualLeaveBank = user?.casualLeaveBank || 0;
  const sickLeaveBank = user?.sickLeaveBank || 0;

  const totalAvailedLeaves = availedCasualLeaves + availedAnnualLeaves + availedSickLeaves;
  const totalLeavesBank = annualLeaveBank + casualLeaveBank + sickLeaveBank;

  const cardData = [
    {
      variant: 'yellow',
      text: 'Total Leaves Count',
      availedLeaves: `${totalAvailedLeaves}`,
      totalLeavesBank: `${totalLeavesBank}`,
      icon: <CiCalculator1 />,
    },
    {
      variant: 'red',
      text: 'Casual Leaves',
      availedLeaves: availedCasualLeaves,
      totalLeavesBank: casualLeaveBank,
      icon: <GiSandsOfTime />,
    },
    {
      variant: 'blue',
      text: 'Sick Leaves',
      availedLeaves: availedSickLeaves,
      totalLeavesBank: sickLeaveBank,
      icon: <CiMedicalCross />,
    },
    {
      variant: 'green',
      text: 'Annual Leaves',
      availedLeaves: availedAnnualLeaves,
      totalLeavesBank: annualLeaveBank,
      icon: <BiSolidPlaneAlt />,
    },
  ];

  return (
    <motion.div
      className="grid size-full grid-cols-2 gap-2 md:h-[62vh] md:w-[95%] xl:w-full xxl:h-[72vh] "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      {cardData.map((card, index) => (
        <motion.div key={card.text} variants={cardVariants} custom={index}>
          <EmployeeOverviewCard
            availedLeaves={card.availedLeaves}
            variant={card.variant as 'yellow' | 'red' | 'blue' | 'green'}
            icon={card.icon}
            totalLeaves={card.totalLeavesBank}
            text={card.text}
            customDelay={0.5 + index * 0.2}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EmployeeOverviewCardsContainer;
