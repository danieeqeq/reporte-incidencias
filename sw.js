
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('reporte-cache').then(function (cache) {
      return cache.addAll([
        './',
        './reportes.html',
        './reportes.css',
        './reportes.js',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
