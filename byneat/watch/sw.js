const CACHE = "neat-watch-v1";
const STATIC = [
  "/byneat/watch/",
  "/byneat/watch/index.html",
  "/byneat/watch/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // No cachear API ni CDN
  if (e.request.url.includes("neat-apps-b.vercel.app") ||
      e.request.url.includes("cdn.neat.qzz.io")) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
