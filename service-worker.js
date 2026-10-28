/**
 * Service Worker Lifecycle & Cleanup Handler
 * -------------------------------------------------------------
 * NOTE: This service worker is NOT actively registered by this application.
 * It is preserved strictly as a cleanup worker for any legacy registrations
 * previously installed in returning visitors' browsers, ensuring stale caches
 * are evicted and clients are released.
 */
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => caches.delete(key)));
        }).then(() => self.clients.claim())
    );
});
