import type { AttendanceRecord, AttendanceResponse } from '@/interfaces/AttendanceRecord';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import ZKLib from 'zkteco-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip, startDate, endDate } = body;

    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
    }

    const [host, portStr] = ip.split(':');
    const port = Number.parseInt(portStr || '4370');

    const zk = new ZKLib(host, port, 10000, 30000);

    await zk.createSocket();

    const attendanceResponse: AttendanceResponse | AttendanceRecord[] = await zk.getAttendances();

    await zk.disconnect();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full end day

    const attendanceLogs = Array.isArray(attendanceResponse)
      ? attendanceResponse
      : Array.isArray((attendanceResponse as AttendanceResponse).data)
        ? (attendanceResponse as AttendanceResponse).data
        : [];

    const filteredLogs = attendanceLogs.filter((log: any) => {
      const logDate = new Date(log.record_time); // use record_time here
      return logDate >= start && logDate <= end;
    });

    return NextResponse.json({
      attendance: {
        logs: filteredLogs,
        userMap: {},
      },
    });
  } catch (error: any) {
    console.error('ZKTeco connection error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to connect to ZKTeco device',
    }, { status: 500 });
  }
}
