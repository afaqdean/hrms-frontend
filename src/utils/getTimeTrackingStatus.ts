// Function to determine color class based on total hours
export const getHoursColorClass = (totalHours: string): string => {
  // Convert totalHours string (e.g., "8:30") to total minutes
  const timeParts = totalHours.split(':');
  const hoursStr = timeParts[0] || '0';
  const minutesStr = timeParts[1] || '0';
  const totalMinutes = (Number.parseInt(hoursStr, 10) * 60) + Number.parseInt(minutesStr, 10);

  // Define thresholds in minutes
  const greenThreshold = 7 * 60 + 45; // 7h 45m = 465 minutes
  const yellowThreshold = 6 * 60; // 6h 00m = 360 minutes

  if (totalMinutes >= greenThreshold) {
    return 'bg-[#177B1B1A] text-[#177B1B]'; // Green
  } else if (totalMinutes >= yellowThreshold) {
    return 'bg-[#FFF3CD] text-[#856404]'; // Yellow
  } else {
    return 'bg-light-danger text-danger'; // Red
  }
};
