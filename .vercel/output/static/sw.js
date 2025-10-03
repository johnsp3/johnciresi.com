// Simple service worker for PWA functionality
self.addEventListener('install', _event => {
  console.log('Service Worker installing');
});

self.addEventListener('activate', _event => {
  console.log('Service Worker activating');
});

self.addEventListener('fetch', event => {
  // Basic fetch handling
  event.respondWith(fetch(event.request));
});
