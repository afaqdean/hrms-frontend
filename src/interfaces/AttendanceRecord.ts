export type AttendanceRecord = {
  sn: number;
  user_id: string;
  record_time: string;
  type: number;
  state: number;
  ip: string;
};

export type AttendanceResponse = {
  data: AttendanceRecord[];
};
