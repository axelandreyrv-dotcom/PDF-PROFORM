// PDF PROFORM - Service Worker v1.2
const CACHE = 'pdfproform-v3';

const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-57.png',
  './icons/icon-60.png',
  './icons/icon-72.png',
  './icons/icon-76.png',
  './icons/icon-114.png',
  './icons/icon-120.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-1024.png'
];

const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll([...LOCAL_ASSETS, ...CDN_ASSETS]))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.warn('[SW] Instalacion parcial:', err);
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          caches.open(CACHE).then(cache => cache.put('./index.html', response.clone()));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      if (url.origin !== self.location.origin && !CDN_ASSETS.includes(e.request.url)) {
        return fetch(e.request);
      }

      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          caches.open(CACHE).then(cache => cache.put(e.request, response.clone()));
        }
        return response;
      }).catch(() => {
        if (url.origin === self.location.origin) return caches.match('./index.html');
        return caches.match(e.request);
      });
    })
  );
});
