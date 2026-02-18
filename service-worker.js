const CACHE_NAME = 'rabia-alqloub-v2.1'; // تغيير رقم الإصدار يضمن التحديث
const ASSETS = [
    './',
    'index.html',
    'manifest.json',
    'assets/quran-v1.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js' // تخزين المكتبة الخارجية أيضاً!
];

// تثبيت الحارس وتخزين الأساسيات
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// تفعيل الحارس وتنظيف النسخ القديمة
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

// الاستجابة الذكية (أوفلاين 100%)
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            // 1. إذا كان الملف في الذاكرة، أرسله فوراً
            if (cachedResponse) return cachedResponse;

            // 2. إذا لم يكن، جربه من الإنترنت
            return fetch(e.request).catch(() => {
                // 3. إذا كان المستخدم يحاول فتح التطبيق (Navigate) ولا يوجد إنترنت، أرسل index.html
                if (e.request.mode === 'navigate') {
                    return caches.match('index.html');
                }
            });
        })
    );
});