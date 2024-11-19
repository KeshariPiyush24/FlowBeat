const CACHE_NAME = 'your-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/*'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('.mp3') ||
        event.request.url.endsWith('.wav') ||
        event.request.url.endsWith('.ogg')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'audio-sync') {
        event.waitUntil(backgroundSync());
    }
}); 