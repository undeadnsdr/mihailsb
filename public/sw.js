/**
 * Service worker страницы.
 *
 * Стратегия: network-first для документов (человек должен видеть свежие цены),
 * cache-first для картинок и шрифтов (они не меняются). Офлайн отдаётся
 * последняя удачная версия страницы — именно это нужно, когда прайс
 * показывают на объекте без связи.
 *
 * Версию кэша поднимать при смене состава файлов.
 */
const CACHE = 'mihail-sb-v1'
const OFFLINE_URL = '/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Документы: сначала сеть, кэш — как страховка от отсутствия связи
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(OFFLINE_URL, copy))
          return response
        })
        .catch(() => caches.match(OFFLINE_URL).then((cached) => cached || Response.error())),
    )
    return
  }

  // Статика: сначала кэш
  if (/\.(?:webp|png|jpg|jpeg|svg|woff2|css|js)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(CACHE).then((cache) => cache.put(request, copy))
            }
            return response
          }),
      ),
    )
  }
})
