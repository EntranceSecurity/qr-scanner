const CACHE_NAME = 'qr-scanner-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/api.js',
  '/js/scanner.js',
  '/js/manualVerify.js',
  '/js/addUser.js',
  '/js/ui.js',
  '/js/state.js',
  '/js/audio.js',
  '/js/utils.js',
  '/sw.js',
  '/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then(response => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match('/index.html'))
      );
      return;
    }

    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then(response => {
            if (request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            if (request.destination === 'image') {
              return new Response('', { status: 404 });
            }
            return null;
          });
      })
    );
  }
});
