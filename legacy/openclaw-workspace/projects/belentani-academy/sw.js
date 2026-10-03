// Belentani Academy - Service Worker
// Offline-first PWA con cache estratégico
const CACHE_NAME = 'belentani-academy-v1.0.0';
const OFFLINE_URL = '/index.html';

// Recursos críticos para el shell de la app
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/courses.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Instalar: precache del app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: estrategia Stale-While-Revalidate para HTML/JSON
// Cache-First para contenido estático
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar GET
  if (request.method !== 'GET') return;

  // Para HTML y JSON: Network-First con fallback a cache
  if (request.headers.get('accept')?.includes('text/html') ||
      url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Para assets: Cache-First
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
      .catch(() => {
        // Fallback para imágenes
        if (request.headers.get('accept')?.includes('image')) {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#1a1a2e" width="100" height="100"/><text fill="#00f0ff" x="50" y="55" text-anchor="middle" font-size="12">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      })
  );
});

// Mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'getVersion') {
    event.ports[0].postMessage(CACHE_NAME);
  }
});
