const CACHE_NAME = 'quran-v15';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // متخزنش أي حاجة - هات الجديد من النت على طول
  if (e.request.url.includes('alquran.cloud')) return;
  if (e.request.destination === 'document') {
    e.respondWith(fetch(e.request, {cache: 'no-store'}));
    return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
