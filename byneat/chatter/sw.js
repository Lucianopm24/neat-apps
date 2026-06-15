const CACHE = "neat-chatter-v1";
const STATIC = [
  "/byneat/chatter/",
  "/byneat/chatter/index.html",
  "/byneat/chatter/manifest.json",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("neat-apps-b.vercel.app")) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener("push", e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='87'>💬</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='87'>💬</text></svg>",
      data: { url: data.url, chatId: data.chatId },
      vibrate: [200, 100, 200],
      tag: `chat-${data.chatId}`,
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const chatId = e.notification.data?.chatId;
  const url = `https://neat.qzz.io/byneat/chatter/${chatId ? "?chat=" + chatId : ""}`;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes("/byneat/chatter") && "focus" in client) {
          client.postMessage({ type: "OPEN_CHAT", chatId });
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
