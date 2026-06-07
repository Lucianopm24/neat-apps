const CACHE = 'standby-v1';
const ASSETS = [
  '/byneat/standbymode/',
  '/byneat/standbymode/index.html',
  // agrega aquí tus CSS, JS, fuentes, etc.
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});