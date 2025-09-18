'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

type MigrationStatus = {
  migrationCompleted: boolean;
  defaultCompanyExists: boolean;
  usersWithCompanyId: number;
  totalUsers: number;
  migrationNeeded: boolean;
};

export default function MigrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session) {
      router.push('/sign-in');
      return;
    }

    if ((session.user as any)?.role?.toLowerCase() !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const checkMigrationStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/migration/status', {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check migration status');
      }

      const data = await response.json();
      setMigrationStatus(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to check status');
    }
  }, [session]);

  const runMigration = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/migration/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Migration failed');
      }

      setMessage(data.message || 'Migration completed successfully');
      await checkMigrationStatus(); // Refresh status
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Migration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const rollbackMigration = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to rollback the migration? This will remove all company associations and is IRREVERSIBLE!')) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/migration/rollback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Rollback failed');
      }

      setMessage(data.message || 'Migration rolled back successfully');
      await checkMigrationStatus(); // Refresh status
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Rollback failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && (session.user as any)?.role?.toLowerCase() === 'admin') {
      checkMigrationStatus();
    }
  }, [session, checkMigrationStatus]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session || (session.user as any)?.role?.toLowerCase() !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Multi-Tenant Migration Management
          </h1>

          {/* Migration Status */}
          {migrationStatus && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-3 text-lg font-semibold">Migration Status</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <span className="font-medium">Migration Completed:</span>
                  <span className={`ml-2 rounded px-2 py-1 text-sm ${
                    migrationStatus.migrationCompleted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                  >
                    {migrationStatus.migrationCompleted ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Default Company Exists:</span>
                  <span className={`ml-2 rounded px-2 py-1 text-sm ${
                    migrationStatus.defaultCompanyExists
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                  >
                    {migrationStatus.defaultCompanyExists ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Users with Company ID:</span>
                  <span className="ml-2 font-mono">{migrationStatus.usersWithCompanyId}</span>
                </div>
                <div>
                  <span className="font-medium">Total Users:</span>
                  <span className="ml-2 font-mono">{migrationStatus.totalUsers}</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={checkMigrationStatus}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Check Status
              </button>

              {migrationStatus?.migrationNeeded && (
                <button
                  type="button"
                  onClick={runMigration}
                  disabled={isLoading}
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Running Migration...' : 'Run Migration'}
                </button>
              )}

              {migrationStatus?.migrationCompleted && (
                <button
                  type="button"
                  onClick={rollbackMigration}
                  disabled={isLoading}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Rolling Back...' : 'Rollback Migration (DANGEROUS)'}
                </button>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-800">Instructions:</h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>
                •
                <strong>Check Status:</strong>
                {' '}
                Verify the current migration state
              </li>
              <li>
                •
                <strong>Run Migration:</strong>
                {' '}
                Add companyId to all existing users and create default company
              </li>
              <li>
                •
                <strong>Rollback:</strong>
                {' '}
                Remove all company associations (use with caution)
              </li>
              <li>• Migration is safe to run multiple times - it will skip if already completed</li>
              <li>• After migration, existing users will be assigned to the "Default Company"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
