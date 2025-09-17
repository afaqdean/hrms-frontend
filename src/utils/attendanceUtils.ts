// Work hours thresholds
const WORK_HOURS = {
  STANDARD: 7.75, // 7h 45m (Green)
  MINIMUM: 6.0, // 6h (Yellow threshold)
};

export type AttendanceStatus = 'good' | 'warning' | 'danger';
export type AttendanceDisplayText = 'Present' | 'Partial' | 'Short';
export type AttendanceIconType = 'check' | 'warning';

export type AttendanceStatusInfo = {
  status: AttendanceStatus;
  displayText: AttendanceDisplayText;
  bgColor: string;
  textColor: string;
  iconType: AttendanceIconType;
};

/**
 * Determines attendance status based solely on total hours worked
 */
export const getAttendanceStatusInfo = (
  totalHours: string | number,
): AttendanceStatusInfo => {
  // Convert totalHours to number if it's a string
  const hours = typeof totalHours === 'string' ? Number.parseFloat(totalHours) : totalHours;

  // Determine status based only on hours worked
  let status: AttendanceStatus;

  if (hours >= WORK_HOURS.STANDARD) {
    status = 'good';
  } else if (hours >= WORK_HOURS.MINIMUM) {
    status = 'warning';
  } else {
    status = 'danger';
  }

  // Status display information
  const displayTextMap: Record<AttendanceStatus, AttendanceDisplayText> = {
    good: 'Present',
    warning: 'Partial',
    danger: 'Short',
  };

  const bgColors: Record<AttendanceStatus, string> = {
    good: 'bg-[#177B1B1A]',
    warning: 'bg-[#FFF8E6]',
    danger: 'bg-[#FEECEB]',
  };

  const textColors: Record<AttendanceStatus, string> = {
    good: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  const iconTypes: Record<AttendanceStatus, AttendanceIconType> = {
    good: 'check',
    warning: 'warning',
    danger: 'warning',
  };

  return {
    status,
    displayText: displayTextMap[status],
    bgColor: bgColors[status],
    textColor: textColors[status],
    iconType: iconTypes[status],
  };
};

/**
 * Simple helper to get just the display text for an attendance status
 */
export const getAttendanceStatusText = (
  totalHours: string | number,
): AttendanceDisplayText => {
  const hours = typeof totalHours === 'string' ? Number.parseFloat(totalHours) : totalHours;

  if (hours >= WORK_HOURS.STANDARD) {
    return 'Present';
  } else if (hours >= WORK_HOURS.MINIMUM) {
    return 'Partial';
  } else {
    return 'Short';
  }
};
