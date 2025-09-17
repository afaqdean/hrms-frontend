export type AttendanceLog = {
  sn: number;
  user_id: string;
  record_time: string;
  type: number;
  state: number;
  ip: string;
};

export type UserMap = { [user_id: string]: string };

export type ProcessedAttendance = {
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
};

export function processAttendanceLogs(logs: AttendanceLog[]): ProcessedAttendance[] {
  if (!logs || logs.length === 0) {
    console.error('No attendance logs found.');
    return [];
  }

  const result: any[] = [];

  logs.forEach((log) => {
    const user_id = log.user_id;
    const date = new Date(log.record_time);

    const formattedDate = date.toISOString().split('T')[0];
    const time = date.toLocaleTimeString();

    const employeeName = `User ${user_id}`;
    const number = user_id;

    if (log.state === 0) {
      result.push({
        dateTime: `${formattedDate} ${time}`,
        name: employeeName,
        status: 'Check In',
        number,
      });
    } else if (log.state === 1) {
      result.push({
        dateTime: `${formattedDate} ${time}`,
        name: employeeName,
        status: 'Check Out',
        number,
      });
    }
  });

  return result.sort((a, b) => {
    if (a.dateTime === b.dateTime) {
      return a.name.localeCompare(b.name);
    }
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });
}
