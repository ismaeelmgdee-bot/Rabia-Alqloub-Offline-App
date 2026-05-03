const CACHE_NAME = 'rabia-alqloub-empire-v3.5-Cloud'; // 👑 التحديث الإمبراطوري لفرض الرادار السحابي
const ASSETS = [
    './',
    'index.html',
    'manifest.json',
    'assets/quran-v1.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// 1. التجنيد والتثبيت (تخزين الأساسيات في الخزنة المدرعة)
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    // تفعيل الحارس الجديد فوراً وتجاوز طابور الانتظار
    self.skipWaiting();
});

// 2. التفعيل وتطهير الميدان من النسخ القديمة
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key); // تدمير الذاكرة القديمة 🗑️
                }
            })
        ))
    );
    // السيطرة الفورية على جميع الشاشات المفتوحة للمستخدم
    self.clients.claim();
});

// 3. الاستجابة التكتيكية (أوفلاين 100% وحماية الذاكرة)
self.addEventListener('fetch', e => {
    // 🛑 استثناء أي طلبات متجهة إلى خادم الإمبراطورية (API) من التخزين المؤقت لضمان حداثة البيانات دائماً
    if (e.request.url.includes('majdi-api-server') || e.request.url.includes('rabia-updates') || e.request.url.includes('extract')) {
        e.respondWith(fetch(e.request));
        return;
    }

    // 🛑 استثناء الملفات الصوتية الضخمة من التخزين الإجباري
    if (e.request.url.includes('.mp3') || e.request.url.includes('.m4a') || e.request.url.includes('.zip')) {
        e.respondWith(fetch(e.request));
        return;
    }

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            // أ. إذا كان الملف في الذاكرة المدرعة، أرسله فوراً بسرعة البرق ⚡
            if (cachedResponse) return cachedResponse;

            // ب. إذا لم يكن، جربه من الإنترنت 🌐
            return fetch(e.request).catch(() => {
                // ج. درع الطوارئ: إذا حاول المستخدم فتح الواجهة ولا يوجد إنترنت، أرسل index.html 🛡️
                if (e.request.mode === 'navigate') {
                    return caches.match('index.html');
                }
            });
        })
    );
});