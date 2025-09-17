'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerTest() {
  const [status, setStatus] = useState<string>('Checking service worker...');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Check if the service worker is registered
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          setStatus('Service worker is registered');
          setSwRegistration(registration);
        } else {
          setStatus('Service worker is not registered');
        }
      }).catch((error) => {
        setStatus(`Error checking service worker registration: ${error.message}`);
      });

      // Check the API endpoint
      fetch('/api/sw-check')
        .then(response => response.json())
        .then((data) => {
          setApiResponse(data);
        })
        .catch((error) => {
          console.error('Error checking service worker via API:', error);
        });
    } else {
      setStatus('Service workers are not supported in this browser');
    }
  }, []);

  const handleRegisterClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          setStatus('Service worker registered successfully');
          setSwRegistration(registration);
        })
        .catch((error) => {
          setStatus(`Service worker registration failed: ${error.message}`);
        });
    }
  };

  const handleUnregisterClick = () => {
    if (swRegistration) {
      swRegistration.unregister().then((success) => {
        if (success) {
          setStatus('Service worker unregistered successfully');
          setSwRegistration(null);
        } else {
          setStatus('Failed to unregister service worker');
        }
      }).catch((error) => {
        setStatus(`Error unregistering service worker: ${error.message}`);
      });
    }
  };

  const handleCheckFilesClick = () => {
    // Check if the service worker file exists
    fetch('/sw.js')
      .then((response) => {
        if (response.ok) {
          setStatus('Service worker file exists');
        } else {
          setStatus(`Service worker file not found: ${response.status}`);
        }
      })
      .catch((error) => {
        setStatus(`Error checking service worker file: ${error.message}`);
      });
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Service Worker Test</h1>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Status</h2>
        <p className="mb-4">{status}</p>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleRegisterClick}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Register Service Worker
          </button>

          <button
            type="button"
            onClick={handleUnregisterClick}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            disabled={!swRegistration}
          >
            Unregister Service Worker
          </button>

          <button
            type="button"
            onClick={handleCheckFilesClick}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Check SW File
          </button>
        </div>
      </div>

      {swRegistration && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Service Worker Details</h2>
          <p>
            <strong>Scope:</strong>
            {' '}
            {swRegistration.scope}
          </p>
          <p>
            <strong>Updating:</strong>
            {' '}
            {swRegistration?.active ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Active:</strong>
            {' '}
            {swRegistration?.active ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Installing:</strong>
            {' '}
            {swRegistration?.installing ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Waiting:</strong>
            {' '}
            {swRegistration.waiting ? 'Yes' : 'No'}
          </p>
        </div>
      )}

      {apiResponse && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">API Check Results</h2>
          <pre className="overflow-auto rounded bg-gray-100 p-4">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
