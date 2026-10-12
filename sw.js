const CACHE_NAME = 'quran-v3';
const FILES = [
  './',
  './index.html',
  './quran-en.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // سيب الـ API يجي من النت مباشر، متخزنوش
  if (e.request.url.includes('alquran.cloud')) return;
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
