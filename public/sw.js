/* eslint-disable no-console */
// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = 'hrms-offline-v1';
const ASSETS = [
  '/offline.html',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

// Install stage sets up the offline page in the cache and opens a new cache
globalThis.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      console.log('[ServiceWorker] Caching assets');
      return cache.addAll(ASSETS)
        .then(() => {
          console.log('[ServiceWorker] All assets cached successfully');
        })
        .catch((error) => {
          console.error('[ServiceWorker] Cache addAll error:', error);
          // Continue with installation even if caching fails
          return Promise.resolve();
        });
    }),
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
globalThis.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If request was successful, add result to cache
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch((_error) => {
        // If network request failed, try to get it from cache
        return fromCache(event.request)
          .catch(() => {
            // If both network and cache failed, serve offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            return Promise.reject(new Error('Failed to fetch and no cache available'));
          });
      }),
  );
});

// Activate event - clean up old caches
globalThis.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );

  // Ensure the service worker takes control immediately
  return globalThis.clients.claim();
});

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      if (!matching || matching.status === 404) {
        return Promise.reject(new Error('no-match'));
      }
      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then((cache) => {
    return cache.put(request, response);
  });
}
