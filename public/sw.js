// Service Worker for John Ciresi Website
const CACHE_NAME = 'john-ciresi-v1';
const STATIC_CACHE = 'static-v1';
const AUDIO_CACHE = 'audio-v1';
const IMAGE_CACHE = 'images-v1';

const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
  '/robots.txt',
];

const AUDIO_ASSETS = [
  '/audio/baby-please.mp3',
  '/audio/dont-say-its-over.mp3',
  '/audio/i-miss-your-touch.mp3',
  '/audio/im-the-visual-man.mp3',
  '/audio/look-at-me.mp3',
  '/audio/losing-you.mp3',
  '/audio/love-can-hurt-so-bad.mp3',
  '/audio/my-life.mp3',
  '/audio/secret-of-my-heart.mp3',
  '/audio/the-one-i-want.mp3',
  '/audio/what-you-mean-to-me.mp3',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(AUDIO_CACHE).then((cache) => cache.addAll(AUDIO_ASSETS)),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== AUDIO_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle audio files with cache-first strategy
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(request).then(async (response) => {
        return response || await fetch(request).then(async (fetchResponse) => {
          return await caches.open(AUDIO_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle images with cache-first strategy
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.match(request).then(async (response) => {
        return response || await fetch(request).then(async (fetchResponse) => {
          return await caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Offline - API not available', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
    );
    return;
  }

  // Default: network-first strategy
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});