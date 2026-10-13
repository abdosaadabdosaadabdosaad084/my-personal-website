const CACHE = "mushaf-v8";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./quran-ar.html"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
