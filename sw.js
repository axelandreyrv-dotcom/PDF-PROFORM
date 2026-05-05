// PDF PROFORM — Service Worker v1.0
// Precaché todos los assets para funcionar 100% offline

const CACHE = 'pdfproform-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js'
];

// Instalación: pre-cachear todo
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log('[SW] Pre-cacheando assets...');
      return cache.addAll(ASSETS).catch(err => console.warn('[SW] Cache parcial:', err));
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first para assets, network-first para navegación
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Para navegación, siempre servir index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then(r => r || fetch(e.request))
    );
    return;
  }

  // Para CDN y assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline y no está en cache: respuesta de error amigable
        if (e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
