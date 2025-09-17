import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import React, { type ReactNode } from 'react';

type EmployeeOverviewCardProps = {
  /** Icon to display inside the card */
  icon?: ReactNode;
  /** Text to display below the icon */
  text?: string;
  /** Number of availed leaves */
  availedLeaves?: number;
  /** Total number of leaves */
  totalLeaves?: number;
  /** Additional custom class names */
  className?: string;
  /** Variant to control the card's background color */
  variant?: 'yellow' | 'red' | 'green' | 'blue';
  /** Custom delay for content animation (set from the container) */
  customDelay?: number;
};

type CounterProps = {
  /** Initial value of the counter */
  from?: number;
  /** Target value of the counter */
  to?: number;
  /** Delay for when the counter animation should start */
  counterDelay?: number;
};

/**
 * Counter component animates the number from `from` to `to`
 * using Framer Motion's `useMotionValue` and `useTransform`.
 */
const Counter = ({ from = 0, to = 0, counterDelay = 0 }: CounterProps) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, latest => Math.round(latest)); // Ensures the displayed number is always an integer

  React.useEffect(() => {
    const animation = animate(count, to, {
      type: 'tween',
      duration: 2, // Smooth animation over 2 seconds
      ease: 'easeInOut',
      delay: counterDelay, // Starts the animation after the specified delay
    });

    return animation.stop; // Cleanup function to stop animation if the component unmounts
  }, [count, to, counterDelay]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: counterDelay, ease: 'easeInOut' }}
      whileHover={{
        scale: 1.1,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      }}
      className="inline-block"
    >
      {rounded}
    </motion.span>
  );
};

/**
 * EmployeeOverviewCard displays an overview of an employee's leave balance,
 * with animations and hover effects.
 */
const EmployeeOverviewCard: React.FC<EmployeeOverviewCardProps> = ({
  icon,
  text,
  availedLeaves = 0,
  totalLeaves = 0,
  className,
  variant = 'yellow',
  customDelay = 0,
}) => {
  // Define background colors for different variants
  const backgroundColors = {
    yellow: 'bg-[#EAB529]', // Yellow
    red: 'bg-[#F44336]', // Red
    green: 'bg-[#177B1B]', // Green
    blue: 'bg-[#2196F3]', // Blue
  };

  // Animation variants for the content inside the card
  const contentVariants = {
    hidden: { opacity: 0, y: 20 }, // Initially hidden with a downward offset
    visible: { opacity: 1, y: 0, transition: { delay: customDelay, duration: 0.5 } }, // Animates in after the delay
  };

  // Counter animation delay, starts after the card content is visible
  const counterDelay = customDelay + 0.5;

  return (
    <motion.div
      whileHover={{
        scale: 1.02, // Slight scale-up effect on hover
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className={`size-full rounded-2xl p-4 md:p-6 ${backgroundColors[variant]} ${className} shadow-md`}
    >
      {/* Animate the card's content with a fade-in and slight upward motion */}
      <motion.div initial="hidden" animate="visible" variants={contentVariants}>
        {/* Display an optional icon inside a rounded container */}
        {icon && (
          <motion.div
            className="flex size-11 items-center justify-center rounded-full bg-white/30 xl:size-14 xxl:size-20"
            whileHover={{
              rotate: 10, // Rotates slightly on hover
              scale: 1.05, // Scales up slightly on hover
              transition: { type: 'spring', stiffness: 300, damping: 10 },
            }}
          >
            <span className="text-2xl text-white xl:text-3xl xxl:text-5xl">{icon}</span>
          </motion.div>
        )}

        {/* Text label below the icon */}
        <motion.p
          className="mb-2 mt-4 text-base text-white xl:text-2xl xxl:text-3xl"
          whileHover={{ scale: 1.02 }} // Slight scaling effect on hover
        >
          {text}
        </motion.p>

        {/* Counter showing availed leaves vs. total leaves */}
        <span className="text-2xl font-bold text-white xl:text-3xl xxl:text-4xl">
          <Counter from={0} to={availedLeaves} counterDelay={counterDelay} />
          <motion.span className="mx-2 inline-block" whileHover={{ scale: 1.1, rotate: 5 }}>
            /
          </motion.span>
          <Counter from={0} to={totalLeaves} counterDelay={counterDelay} />
        </span>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeOverviewCard;
