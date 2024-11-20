const CACHE_NAME = 'flowbeat-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/*',
    '/src/styles/*.css',
    '/src/components/**/*.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('youtube.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'audio-sync') {
        event.waitUntil(backgroundSync());
    }
});

self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/assets/icon.png',
        badge: '/assets/icon.png',
        vibrate: [100, 50, 100]
    };

    event.waitUntil(
        self.registration.showNotification('FlowBeat', options)
    );
}); 