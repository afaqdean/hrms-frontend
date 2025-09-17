import type { AttendanceLog } from '@/utils/AttendanceLogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useEmployees from '@/hooks/useEmployees';
import { useUploadAttendance } from '@/hooks/useUploadAttendance';
import { processAttendanceLogs } from '@/utils/AttendanceLogs';
// import ModalUI from '@/components/Modal';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';

type ImportDeviceProps = {
  onClose: () => void;
};

const ImportDevice: React.FC<ImportDeviceProps> = ({ onClose }) => {
  const [deviceIP, setDeviceIP] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const { Employees } = useEmployees();
  const { upload } = useUploadAttendance();

  const handleDeviceConnect = async (ipAddress: string) => {
    try {
      const response = await fetch('/api/zkt-eco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: ipAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Connection failed: ${data.error}`);
        return;
      }

      toast.success('Connection successful!');

      // Move to next step
      setStep(2);
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('An error occurred while connecting to the device.');
    }
  };

  const handleConnect = async () => {
    if (!deviceIP.trim()) {
      toast.error('Please enter an IP address');
      return;
    }

    setIsConnecting(true);
    try {
      await handleDeviceConnect(deviceIP.trim());
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGetAttendance = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/get-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: deviceIP,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Failed to fetch attendance: ${data.error}`);
        return;
      }

      if (!data.attendance || !Array.isArray(data.attendance.logs) || !data.attendance.userMap) {
        toast.error('Attendance data is missing or invalid.');
        console.error('Unexpected response format:', data);
        return;
      }

      const attendanceLogs: AttendanceLog[] = data.attendance.logs;

      const formattedAttendance = processAttendanceLogs(attendanceLogs);

      const transformedLogs = formattedAttendance
        .map((log: any) => {
          const rawUserId = log.name || ''; // e.g. "User 5"
          const userId = rawUserId.replace(/\D/g, ''); // Extract numeric part, e.g. "5"

          const matchedEmployee = Employees?.find((emp) => {
            const normalizedMachineID = emp.machineID?.replace(/^0+/, ''); // Remove leading zeros
            return normalizedMachineID === userId; // Compare the cleaned user_id with machineID
          });

          if (!matchedEmployee) {
            console.warn(`No employee found for user_id: ${userId}`);
            return null;
          }

          return {
            dateTime: log.dateTime, // Include dateTime as is
            name: matchedEmployee.name, // Add the correct employee name
            number: log.number, // Include the number
            status: log.status, // Include status (Check In or Check Out)
          };
        })
        .filter((log: any) => log !== null); // Filter out nulls from unmatched logs

      await upload(transformedLogs);
      toast.success('Attendance data uploaded successfully.');

      onClose(); // Close modal
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('An unexpected error occurred while fetching attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-72 space-y-4 sm:w-96 md:w-[28rem] md:space-y-6">
      <h1 className="text-sm font-medium text-primary-100 md:text-base">
        Connect to ZKEco Device
      </h1>

      {step === 1 && (
        <>
          <p className="text-sm font-normal text-secondary-300 md:text-base">
            Please enter the IP address of the ZKEco biometric device you'd like to connect to.
          </p>

          <div>
            <label htmlFor="device-ip" className="mb-1 block text-sm font-medium text-primary-100">
              Device IP Address
            </label>
            <Input
              id="device-ip"
              type="text"
              placeholder="e.g. 192.168.1.201"
              value={deviceIP}
              onChange={e => setDeviceIP(e.target.value)}
              disabled={isConnecting}
            />
          </div>

          <div className="flex w-full justify-between gap-2">
            <Button variant="secondary" onClick={onClose} className="w-1/2" disabled={isConnecting}>
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              className="flex w-1/2 items-center justify-center"
              disabled={!deviceIP || isConnecting}
            >
              {isConnecting
                ? (
                    <>
                      <svg className="-ml-1 mr-3 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connecting...
                    </>
                  )
                : (
                    'Connect'
                  )}
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-base font-semibold text-primary-100">Select Date Range</h2>
          <p className="text-sm text-secondary-300">
            Choose the date range to fetch attendance records.
          </p>

          <div>
            <label htmlFor="start-date" className="mb-1 block text-sm font-medium text-primary-100">Start Date</label>
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date ?? undefined)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label htmlFor="end-date" className="mb-1 block text-sm font-medium text-primary-100">End Date</label>
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date ?? undefined)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleGetAttendance}
              disabled={!startDate || !endDate || loading}
              className="flex items-center gap-2 rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="size-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? 'Loading...' : 'Get Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImportDevice;
