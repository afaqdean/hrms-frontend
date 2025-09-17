import type { Attendance } from '../interfaces/Attendance';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

type AttendanceQueryParams = {
  id?: string;
  name?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
};

export const useFetchAttendance = (queryParams: AttendanceQueryParams) => {
  const calculateTotalHours = (checkIn: string, checkOut: string) => {
    const parseTime = (time: string) => {
      const match = time.match(/(\d+):(\d+)\s([APM]+)/i);
      if (!match) {
        throw new Error(`Invalid time format: ${time}`);
      }

      const [, hours, minutes, period] = match;
      let hours24 = Number(hours);
      if (period?.toUpperCase() === 'PM' && hours24 < 12) {
        hours24 += 12;
      }
      if (period?.toUpperCase() === 'AM' && hours24 === 12) {
        hours24 = 0;
      }

      return new Date(1970, 0, 1, hours24, Number(minutes));
    };

    const checkInTime = parseTime(checkIn);
    const checkOutTime = parseTime(checkOut);
    const totalMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60);

    return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}h ${String(totalMinutes % 60).padStart(2, '0')}m`;
  };

  const convertTo24Hour = (time: string): string => {
    if (!time) {
      return '00:00:00';
    }

    const [timePart, modifier] = time.split(' ');
    const [hours = 0, minutes = 0] = timePart?.split(':').map(Number) ?? [0, 0];

    let adjustedHours = hours;
    if (modifier === 'PM' && adjustedHours < 12) {
      adjustedHours += 12;
    }
    if (modifier === 'AM' && adjustedHours === 12) {
      adjustedHours = 0;
    }

    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const fetchAttendance = async () => {
    const { data: responseData } = await API.get(`/attendance`, { params: queryParams });

    if (responseData) {
      return responseData.attendanceData.map((item: Attendance) => {
        const dateObj = new Date(item.date);
        const standardizedCheckIn = convertTo24Hour(item.firstCheckIn);
        const checkInTime = new Date(`1970-01-01T${standardizedCheckIn}`);

        return {
          ...item,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
          status: checkInTime <= new Date('1970-01-01T09:00:00') ? 'on time' : 'late',
          totalHours: calculateTotalHours(item.firstCheckIn, item.lastCheckOut),
        };
      });
    }
    return [];
  };

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['attendance', queryParams],
    queryFn: fetchAttendance,
  });

  return { data, loading, error };
};
