/**
 * Service Worker for Daniel Wanjala's Portfolio
 * Implements cache-first strategy for assets and network-first for HTML
 */

const CACHE_NAME = 'portfolio-cache-v1';
const OFFLINE_URL = '/index.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/projects.html',
    '/skills.html',
    '/education.html',
    '/contact.html',
    '/assets/logo.png',
    '/github-stats.css',
    '/analytics.js',
    '/manifest.json'
];

// External resources to cache (CDN assets)
const EXTERNAL_CACHE = [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Satoshi:wght@400;500;700&family=Inter:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=JetBrains+Mono:wght@400&display=swap'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Pre-caching critical assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.log('Pre-cache failed:', err);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;

    // Skip Spotify and other streaming services
    if (url.hostname.includes('spotify') || 
        url.hostname.includes('scdn.co')) {
        return;
    }

    // Network-first strategy for HTML pages (always get fresh content)
    if (request.mode === 'navigate' || 
        request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Return cached version or offline page
                    return caches.match(request)
                        .then((cached) => cached || caches.match(OFFLINE_URL));
                })
        );
        return;
    }

    // Cache-first strategy for static assets (images, CSS, JS, fonts)
    if (request.destination === 'image' ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'font' ||
        url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2)$/)) {
        event.respondWith(
            caches.match(request)
                .then((cached) => {
                    if (cached) {
                        // Return cached version, but also fetch and update cache in background
                        fetch(request).then((response) => {
                            if (response.ok) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, response);
                                });
                            }
                        }).catch(() => {});
                        return cached;
                    }
                    // Not in cache, fetch and cache
                    return fetch(request).then((response) => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    });
                })
        );
        return;
    }

    // Default: network with cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
