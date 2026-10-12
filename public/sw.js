/* ─────────────────────────────────────────────────────────────
 * VESTIOR — Service Worker
 *
 * Caching strategy:
 *   • Static assets (JS/CSS/fonts)  → Cache-first (immutable)
 *   • Images                         → Stale-while-revalidate
 *   • API routes                     → Network-first, no cache
 *   • HTML pages                     → Network-first, cache fallback
 *   • Offline fallback               → /offline.html
 *
 * Version bump `CACHE_VERSION` to force update on deploy.
 * ───────────────────────────────────────────────────────────── */

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `vestior-static-${CACHE_VERSION}`
const IMAGE_CACHE = `vestior-images-${CACHE_VERSION}`
const PAGE_CACHE = `vestior-pages-${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

// ─────────────────────────────────────────────────────────────
// Install — pre-cache the offline page
// ─────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  )
})

// ─────────────────────────────────────────────────────────────
// Activate — clean up old caches
// ─────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowedCaches = new Set([STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE])

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !allowedCaches.has(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─────────────────────────────────────────────────────────────
// Fetch — route requests by type
// ─────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET
  if (request.method !== 'GET') return

  // Only same-origin requests (skip Supabase/CDN/analytics)
  if (url.origin !== self.location.origin) return

  // Skip admin, api, auth — never cache these
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/_next/webpack') ||
    url.pathname.startsWith('/_next/static/chunks/app/(main)/admin')
  ) {
    return
  }

  // Static assets — cache-first (JS/CSS/fonts)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/suits/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(?:js|css|woff2?|ttf|otf)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Images — stale-while-revalidate
  if (
    url.pathname.startsWith('/images/') ||
    /\.(?:png|jpg|jpeg|webp|avif|gif|svg|ico)$/.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE))
    return
  }

  // HTML pages — network-first, cache fallback, then offline
  if (
    request.headers.get('accept')?.includes('text/html') &&
    !url.pathname.startsWith('/_next')
  ) {
    event.respondWith(networkFirstWithOffline(request))
    return
  }
})

// ─────────────────────────────────────────────────────────────
// Caching strategies
// ─────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('', { status: 504 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || fetchPromise
}

async function networkFirstWithOffline(request) {
  const cache = await caches.open(PAGE_CACHE)

  try {
    const response = await fetch(request)
    // Cache successful HTML responses for offline use
    if (response.ok && response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Offline fallback chain
    const cached = await cache.match(request)
    if (cached) return cached

    const offline = await cache.match(OFFLINE_URL)
    if (offline) return offline

    return new Response('Offline', { status: 503 })
  }
}

// ─────────────────────────────────────────────────────────────
// Message handler (for manual cache control from client)
// ─────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})