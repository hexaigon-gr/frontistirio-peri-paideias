/**
 * Kill switch, not a real service worker.
 *
 * This project never registers one. A worker left behind on localhost by another
 * project on the same port keeps intercepting requests and serving its own stale
 * cache, which looks exactly like "the site did not update". The browser still
 * fetches this URL to check for an update, so answering with a worker that wipes
 * every cache and unregisters itself removes the ghost for good.
 *
 * Safe to keep in production: nothing on this site registers a service worker.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((window) => window.navigate(window.url));
    })(),
  );
});
