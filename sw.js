const CACHE = "mushaf-v11";
const ASSETS = [
  "/my-personal-website/",
  "/my-personal-website/index.html",
  "/my-personal-website/manifest.json",
  "/my-personal-website/icon-192.png",
  "/my-personal-website/icon-512.png",
  "/my-personal-website/quran-ar.html",
  "/my-personal-website/quran-en.html",
  "/my-personal-website/tafsir.html"
  // زود هنا أي ملفات mp3 أو json للقرآن لو عندك
];

// 1. عند التثبيت احفظ كل حاجة
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 2. عند التفعيل امسح النسخ القديمة بس
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 3. استراتيجية: Cache First للملفات، Network First للصفحات
self.addEventListener("fetch", e => {
  const req = e.request;
  
  // لو ملف صوت أو صورة أو css/js خده من الكاش الأول (سريع)
  if (req.url.match(/\.(png|jpg|css|js|mp3|woff2)$/)) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        return caches.open(CACHE).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      }))
    );
    return;
  }

  // لو صفحة html جرب النت الأول وبعدين الكاش (عشان التحديثات)
  e.respondWith(
    fetch(req).then(res => {
      return caches.open(CACHE).then(cache => {
        cache.put(req, res.clone());
        return res;
      });
    }).catch(() => caches.match(req).then(r => r || caches.match("/my-personal-website/")))
  );
});
