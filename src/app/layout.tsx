/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { Metadata, Viewport } from 'next';
import { AuthErrorHandler } from '@/components/AuthErrorHandler';
// Import ReactQueryWrapper normally since it's a Client Component
import ReactQueryWrapper from '@/components/ReactQueryWrapper';

import StructuredData from '@/components/StructuredData';
import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import { AuthProvider } from '@/context/AuthContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { NotificationProvider } from '@/context/NotificationContext';
import arcjet, { detectBot, request } from '@/libs/Arcjet';
import { Env } from '@/libs/Env';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';

import { Poppins } from 'next/font/google';
// src/app/[locale]/(auth)/layout.tsx
import { Suspense } from 'react';
import { defaultMetadata } from './metadata';
import '@/styles/global.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
export const metadata: Metadata = {
  ...defaultMetadata,
  // Override any specific metadata if needed
};

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  display: 'block',
  variable: '--font-poppins',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});
// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: [
      'CATEGORY:SEARCH_ENGINE',
      'CATEGORY:PREVIEW',
      'CATEGORY:MONITOR',
    ],
  }),
);
export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
}>) {
  // Verify the request with Arcjet
  if (Env.ARCJET_KEY) {
    const req = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        throw new Error('No bots allowed');
      }
      throw new Error('Access denied');
    }
  }
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffffff" />
        {/* Remove the incorrect splash screen reference */}
        {/* <link rel="apple-touch-startup-image" href="/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" /> */}

        {/* iPhone 16 Pro Max */}
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16_Pro_Max_portrait.png" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16_Pro_Max_landscape.png" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />

        {/* iPhone 16 Pro */}
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16_Pro_portrait.png" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16_Pro_landscape.png" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />

        {/* iPhone 15/14 Pro */}
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />

        {/* iPhone 13/12 */}
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />

        {/* iPhone 11 Pro/XS/X */}
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                let registration = null;
                let updateFoundListener = null;
                let stateChangeListener = null;
                let messageListener = null;
                
                window.addEventListener('load', function() {
                  // Check if the service worker file exists before registering
                  fetch('/sw.js')
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Service worker file not found: ' + response.status);
                      }
                      
                      // File exists, proceed with registration
                      return navigator.serviceWorker.register('/sw.js', { 
                        scope: '/',
                        updateViaCache: 'none'
                      });
                    })
                    .then(reg => {
                      registration = reg;
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                      
                      // Handle updates
                      updateFoundListener = () => {
                        const newWorker = registration.installing;
                        console.log('Service Worker update found!');
                        
                        stateChangeListener = () => {
                          console.log('Service Worker state changed:', newWorker.state);
                        };
                        
                        newWorker.addEventListener('statechange', stateChangeListener);
                      };
                      
                      registration.addEventListener('updatefound', updateFoundListener);
                    })
                    .catch(error => {
                      console.error('Service Worker registration failed: ', error);
                    });

                });
                
                // Log any service worker messages
                messageListener = (event) => {
                  console.log('Message from Service Worker:', event.data);
                };
                
                navigator.serviceWorker.addEventListener('message', messageListener);
                
                // Cleanup function to remove event listeners
                window.addEventListener('beforeunload', function() {
                  if (registration && updateFoundListener) {
                    registration.removeEventListener('updatefound', updateFoundListener);
                  }
                  if (stateChangeListener) {
                    // Note: We can't remove this as the worker might be gone
                  }
                  if (messageListener) {
                    navigator.serviceWorker.removeEventListener('message', messageListener);
                  }
                });
              } else {
                console.log('Service workers are not supported in this browser.');
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-poppins">
        {' '}
        {/* Add this class */}
        <Suspense fallback={<div>Loading...</div>}>
          <SessionProvider>
            <AuthProvider>
              <LoadingProvider>
                <MultiStepFormProvider>
                  <ReactQueryWrapper>
                    <NotificationProvider>
                      {props.children}
                      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />

                      {/* Add structured data for better SEO */}
                      <StructuredData type="Organization" />
                      <StructuredData type="WebSite" />

                      {/* Add the AuthErrorHandler for handling 401 errors */}
                      <AuthErrorHandler />
                    </NotificationProvider>
                  </ReactQueryWrapper>
                </MultiStepFormProvider>
              </LoadingProvider>
            </AuthProvider>
          </SessionProvider>
        </Suspense>

      </body>
    </html>
  );
}
